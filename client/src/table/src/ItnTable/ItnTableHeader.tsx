import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';
import { LooseObject } from '../base/LooseObject';
import ItnHeadCell from './ItnHeadCell';
import { TableContext } from './Table';
import { SET_SELECT } from './tableReducer';

function ItnTableHeader() {
    const tableCtx = useContext(TableContext)!;

    const displayColumns = useMemo(() => tableCtx.columns.filter(c => c.display && !c.systemHide), [tableCtx.columns]);

    const handleSelectAll = useCallback(() => {
        let selection: LooseObject[] = [];
        if (tableCtx.selectedRows.length !== tableCtx.pageSize) {
            selection = tableCtx.rows.map(r => r[tableCtx.idField!]);
        }
        tableCtx.dispatch({ type: SET_SELECT, selectedRows: selection });
        tableCtx.onRowSelect && tableCtx.onRowSelect(selection);
    }, [tableCtx.selectedRows, tableCtx.pageSize, tableCtx.dispatch, tableCtx.rows, tableCtx.idField, tableCtx.onRowSelect]);

    return (
        <TableRow>
            {
                tableCtx.enableRowsSelection &&
                <TableCell width="50px">
                    <Checkbox
                        sx={{ p: 0 }}
                        checked={tableCtx.selectedRows.length === tableCtx.pageSize}
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