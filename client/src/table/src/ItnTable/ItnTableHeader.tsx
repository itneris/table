import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import ItnHeadCell from './ItnHeadCell';
import { useTableContext } from '../context/TableContext';
import { SET_SELECTED_ROWS } from './tableReducer';

function ItnTableHeader<T>() {
    const { enableRowsSelection, idField, columns, rows, selectedRows, dispatch, onRowSelect } = useTableContext<T>();

    const displayColumns = useMemo(() => columns.filter(c => c.display && !c.systemHide), [columns]);

    const canRowBeSelected = useCallback((row: T) => {
        if (typeof (enableRowsSelection) !== "function") {
            return enableRowsSelection;
        }

        return enableRowsSelection(row);
    }, [enableRowsSelection])

    const isPageChecked = useMemo(() => {
        const allAvailableRowsSelected = !rows
            .some(row =>
                selectedRows.find(select => select === row[idField!]) === undefined &&
                canRowBeSelected(row)
            );
        return allAvailableRowsSelected && selectedRows.length > 0;
    }, [rows, selectedRows, idField, canRowBeSelected]);

    const handleSelectAll = () => {
        let selection: string[] = [...selectedRows];
        if (isPageChecked) {
            const unselectedRows = rows
                .filter(row => canRowBeSelected(row));

            selection = selection.filter(sel => !unselectedRows.some(row => row[idField!] === sel));

            onRowSelect && onRowSelect(unselectedRows, false);
        } else {
            const selectedRows = rows
                .filter(row => !selection.some(sel => row[idField!] === sel) && canRowBeSelected(row));

            selection = [
                ...selection,
                ...selectedRows.map(row => row[idField!]) as string[]
            ];
            onRowSelect && onRowSelect(selectedRows, true);
        }
        dispatch({ type: SET_SELECTED_ROWS, selectedRows: selection });
    };

    return (
        <TableRow>
            {
                enableRowsSelection !== false &&
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