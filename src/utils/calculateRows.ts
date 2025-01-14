import type { TableState } from "../props/TableState";
import type { ColumnSettings } from "../types/ColumnProps";

export default function calculateRows<T>(data: T[], state: TableState, columns: ColumnSettings<T>[]) {
    let rows = [...data];

    rows = search(rows, state, columns);
    rows = orderBy(rows, state, columns);

    rows = rows.slice(state.page * state.pageSize, state.page * state.pageSize + state.pageSize);

    return rows;    
}

function search<T>(rows: T[], state: TableState, columns: ColumnSettings<T>[]) {
    if (rows.length === 0) {
        return rows;
    }

    const searching = state.searching.trim().toLowerCase();

    if (searching === "") {
        return rows;
    }

    return rows.filter(r => {
        const searchString = columns
            .reduce((a, b) => {
                if (typeof r[b.name as keyof typeof r] === "string") {
                    const value = (r[b.name as keyof typeof r] as string).toLowerCase();
                    return a === "" ? value : `${a} ${value}`;
                }

                return a;
            }, "");

        return searchString.includes(searching);
    });
}

function orderBy<T>(rows: T[], state: TableState, columns: ColumnSettings<T>[]) {
    let sortedRows = [...rows]; // Create a copy of the original array

    state.sorting.forEach(sort => {
        sortedRows = sortedRows.sort((a, b) => {
            let key = sort.column as keyof typeof a;
            const colType = columns.find(col => col.name === key)?.type;
            if (!colType) {
                return 1;
            }
            let aVal: T[keyof T] | number = a[key];
            let bVal: T[keyof T] | number = b[key];

            if (colType === "datetime" || colType === "date") {
                if (!a[key]) {
                    return sort.ascending ? -1 : 1;
                }

                if (!b[key]) {  
                    return sort.ascending ? 1 : -1;
                }

                aVal = new Date(a[key] as string).getTime();
                bVal = new Date(b[key] as string).getTime();
            }

            if (aVal < bVal) {
                return sort.ascending ? -1 : 1;
            } else {
                return sort.ascending ? 1 : -1;
            }
        });
    });

    return sortedRows;
}