import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';
import ItnHeadCell from './ItnHeadCell';
import { TableContext } from './Table';
import { SET_SELECT } from './tableReducer';

function ItnTableHeader() {
    const tableCtx = useContext(TableContext)!;

    const displayColumns = useMemo(() => tableCtx.columns.filter(c => c.display && !c.systemHide), [tableCtx.columns]);

    const isPageChecked = useMemo(() => {
        return tableCtx.rows.find(row => tableCtx.selectedRows.find(select => select === row[tableCtx.idField!]) === undefined) === undefined;
    }, [tableCtx.rows, tableCtx.selectedRows, tableCtx.idField]);

    const handleSelectAll = useCallback(() => {
        let selection: string[] = [...tableCtx.selectedRows];
        if (isPageChecked) {
            selection = selection.filter(sel => tableCtx.rows.find(row => row[tableCtx.idField!] === sel) === undefined);
        } else {
            selection = [...selection, ...tableCtx.rows.filter(row => selection.find(sel => row[tableCtx.idField!] === sel) === undefined).map(row => row[tableCtx.idField!])];
        }
        tableCtx.dispatch({ type: SET_SELECT, selectedRows: selection });
        tableCtx.onRowSelect && tableCtx.onRowSelect(selection);
    }, [tableCtx.selectedRows, tableCtx.pageSize, tableCtx.dispatch, tableCtx.rows, tableCtx.idField, tableCtx.onRowSelect, isPageChecked]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TableRow>
            {
                tableCtx.enableRowsSelection &&
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