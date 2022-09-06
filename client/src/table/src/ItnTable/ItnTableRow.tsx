import { TableRow } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { LooseObject } from '../base/LooseObject';
import ItnTableCell from './ItnTableCell';
import { TableContext } from './Table';

function ItnTableRow(props: { row: LooseObject }) {
    const tableCtx = useContext(TableContext)!;

    const displayColumns = useMemo(() => tableCtx.columns.filter(c => c.display && !c.systemHide), [tableCtx.columns]);
    const idProp = tableCtx.idField as keyof typeof props.row;

    return (
        <>
            <TableRow
                hover={tableCtx.onRowClick != null}
                style={{
                    cursor: tableCtx.onRowClick ? "pointer" : "default",
                    //backgroundColor: stripedRows && rowI % 2 ? '#fafafa' : color ? color(n) : undefined,
                    //display: !n.totalId || openTotals.includes(n.totalId) ? "table-row" : "none"
                }}
                //onClick={() => !n.totalRow && onRowClick && onRowClick(n)}
                onClick={() => tableCtx.onRowClick && tableCtx.onRowClick(props.row[idProp] as unknown as string, props.row)}
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