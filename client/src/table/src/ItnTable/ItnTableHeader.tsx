import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';
import ItnHeadCell from './ItnHeadCell';
import { TableContext } from './Table';
import { SET_SELECTED_ROWS } from './tableReducer';

function ItnTableHeader() {
    const tableCtx = useContext(TableContext)!;

    const displayColumns = useMemo(() => tableCtx.columns.filter(c => c.display && !c.systemHide), [tableCtx.columns]);


    const canRowBeSelected = useCallback((row: any) => {
        if (typeof (tableCtx.enableRowsSelection) !== "function") {
            return tableCtx.enableRowsSelection;
        }

        return tableCtx.enableRowsSelection(row);
    }, [tableCtx.enableRowsSelection])

    const isPageChecked = useMemo(() => {
        return tableCtx.rows
            .find(row => tableCtx.selectedRows.find(select => select === row[tableCtx.idField!] && canRowBeSelected(row)) === undefined) === undefined &&
            tableCtx.selectedRows.length > 0;
    }, [tableCtx.rows, tableCtx.selectedRows, tableCtx.idField, canRowBeSelected]);

    const handleSelectAll = useCallback(() => {
        let selection: string[] = [...tableCtx.selectedRows];
        if (isPageChecked) {
            selection = selection.filter(sel => tableCtx.rows.find(row => row[tableCtx.idField!] === sel && canRowBeSelected(row)) === undefined);
        } else {
            selection = [
                ...selection,
                ...tableCtx.rows
                    .filter(row => selection.find(sel => row[tableCtx.idField!] === sel) === undefined && canRowBeSelected(row))
                    .map(row => row[tableCtx.idField!])
            ];
        }
        tableCtx.dispatch({ type: SET_SELECTED_ROWS, selectedRows: selection });
        tableCtx.onRowSelect && tableCtx.onRowSelect(selection);
    }, [
        tableCtx.selectedRows,
        tableCtx.pageSize,
        tableCtx.dispatch,
        tableCtx.rows,
        tableCtx.idField,
        tableCtx.onRowSelect,
        isPageChecked,
        canRowBeSelected
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TableRow>
            {
                tableCtx.enableRowsSelection !== false &&
                <TableCell width="50px">
                    <Checkbox
                        sx={{ p: 0 }}
                        checked={isPageChecked}
                        onChange={handleSelectAll}
                    />
                </TableCell>
            }
            {
                displayColumns.map((c, i) => <ItnHeadCell key={"hd2" + i} column={c} />)
            }
        </TableRow>
    );
}

export default ItnTableHeader;