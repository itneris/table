import { ITableProperties } from "../props/ITableProperties";
import { TableState } from "../props/TableState";

const EMPTY_STRING_ARRAY = [] as string[];

function getTableInitState<T>(props: ITableProperties<T>) {
    let propsState = {
        filtering: props.filtering,
        searching: props.searching ?? "",
        sorting: props.sorting,
        pageSize: props.pageSize ?? 10,
        page: props.page ?? 0,
        selectedRows: props.selectedRows ?? EMPTY_STRING_ARRAY
    } as TableState;

    if (!props.saveState) {
        return propsState;
    } else {
        let tableState: any;
        if (props.saveState.type === "storage" && localStorage.getItem(props.saveState.name)) {
            tableState = JSON.parse(localStorage.getItem(props.saveState.name)!);
        } else if (props.saveState.type === "session" && sessionStorage.getItem(props.saveState.name)) {
            tableState = JSON.parse(sessionStorage.getItem(props.saveState.name)!);
        }

        if (tableState) {
            return {
                filtering: tableState.filtering ?? props.filtering,
                searching: tableState.searching ?? props.searching ?? "",
                sorting: tableState.sorting ?? props.sorting,
                pageSize: tableState.pageSize ?? props.pageSize ?? 10,
                page: tableState.page ?? props.page ?? 0,
                selectedRows: props.selectedRows ?? EMPTY_STRING_ARRAY
            } as TableState;
        } else {
            return propsState;
        }
    }
}

export default getTableInitState;