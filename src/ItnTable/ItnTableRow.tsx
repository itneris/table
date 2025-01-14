import { Checkbox, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import ItnTableCell from './ItnTableCell';
import { useTableContext } from '../context/TableContext';
import { useTableStateContext } from '../context/TableStateContext';

function ItnTableRow<T>(props: { row: T }) {
    const { columns, idField, onRowClick, enableRowsSelection } = useTableContext<T>();
    const { selectedRows, onRowSelect } = useTableStateContext<T>();

    const displayColumns = useMemo(() => columns.filter(c => c.display), [columns]);
    const idProp = idField!;
    const row = props.row;

    const isRowChecked = useMemo(() => {
        return selectedRows.find(r => r === row[idProp]) !== undefined
    }, [selectedRows, idProp, row]);

    const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>) => {
        let selection: string[] = [...selectedRows];
        let isSelected: boolean;

        if (selectedRows.find(r => r === row[idProp]) === undefined) {
            selection.push(row[idProp] as string);
            isSelected = true;
        } else {
            selection = selection.filter(r => r !== row[idProp]);
            isSelected = false;
        }

        onRowSelect && onRowSelect([row], isSelected);
    };

    const handleRowClick = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
        if ((e.target as any).nodeName === "INPUT") {
            return;
        }
        onRowClick && onRowClick(row[idProp] as unknown as string, row);
    }, [onRowClick, row, idProp]); // eslint-disable-line react-hooks/exhaustive-deps

    const canRowBeSelected = useMemo(() => {
        if (typeof (enableRowsSelection) !== "function") {
            return enableRowsSelection;
        }

        return enableRowsSelection(row);
    }, [enableRowsSelection, row])

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
                        const key = `r-${row[idProp]}-c-${column.name}`;
                        return <ItnTableCell key={key} row={row} column={column} />
                    })
                }
            </TableRow>
        </>
    );
}

export default ItnTableRow;