import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import ItnTableCell from './ItnTableCell';
import { useTableContext } from '../context/TableContext';
import { SET_SELECTED_ROWS } from './tableReducer';

function ItnTableRow<T>(props: { row: T }) {
    const { columns, idField, selectedRows, onRowSelect, rows, dispatch, onRowClick, enableRowsSelection } = useTableContext<T>();

    const displayColumns = useMemo(() => columns.filter(c => c.display && !c.systemHide), [columns]);
    const idProp = idField!;


    const isRowChecked = useMemo(() => {
        return selectedRows.find(r => r === props.row[idProp]) !== undefined
    }, [selectedRows, idProp, props.row]);

    const handleSelectRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let selection: string[] = [...selectedRows];
        if (selectedRows.find(r => r === props.row[idProp]) === undefined) {
            selection.push(props.row[idProp] as string);
        } else {
            selection = selection.filter(r => r !== props.row[idProp]);
        }
        dispatch({ type: SET_SELECTED_ROWS, selectedRows: selection });
        onRowSelect && onRowSelect(selection);
    }, [selectedRows, dispatch, rows, idProp, props.row, onRowSelect]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRowClick = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
        if ((e.target as any).nodeName === "INPUT") {
            return;
        }
        onRowClick && onRowClick(props.row[idProp] as unknown as string, props.row);
    }, [onRowClick, props.row, idProp]); // eslint-disable-line react-hooks/exhaustive-deps

    const canRowBeSelected = useMemo(() => {
        if (typeof (enableRowsSelection) !== "function") {
            return enableRowsSelection;
        }

        return enableRowsSelection(props.row);
    }, [enableRowsSelection, props.row])

    return (
        <>
            <TableRow
                hover={onRowClick != null}
                style={{
                    cursor: onRowClick ? "pointer" : "default",
                    //backgroundColor: stripedRows && rowI % 2 ? '#fafafa' : color ? color(n) : undefined,
                    //display: !n.totalId || openTotals.includes(n.totalId) ? "table-row" : "none"
                }}
                //onClick={() => !n.totalRow && onRowClick && onRowClick(n)}
                onClick={handleRowClick}
                /*onContextMenu={e => {
                    if (context) {
                        e.preventDefault();
                        let visibleContext = context.filter(c => c.hidden === undefined || c.hidden === null || c.hidden(n) === false);
                        if (visibleContext.length > 0) {
                            setContextOptions(
                                contextOptions === null ?
                                    { position: { x: e.clientX - 2, y: e.clientY - 4 }, context: visibleContext, id: n[idField], row: n } :
                                    {}
                            );
                        }
                    }
                }}*/
            >
                {
                    enableRowsSelection !== false &&
                    <TableCell
                        width="50px"
                        onClick={e => e.stopPropagation()}
                    >
                        <Checkbox
                            sx={{ p: 0 }}
                            disabled={!canRowBeSelected}
                            checked={isRowChecked}
                            onChange={handleSelectRow}
                        />
                    </TableCell>
                }
                {
                    displayColumns.map((column) => {
                        const key = `r-${props.row[idProp]}-c-${column.property}`;
                        return <ItnTableCell key={key} row={props.row} column={column} />
                    })
                }
            </TableRow>
        </>
    );
}

export default ItnTableRow;