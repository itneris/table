import { TableCell } from '@mui/material';
import { format } from 'date-fns';
import React, { ReactNode, useContext, useMemo } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { ITableContext } from '../props/ITableContext';
import { TableContext } from './Table';

function ItnTableCell<T>(props: { row: T, column: ColumnDescription<T> }) {
    const tableCtxBase = useContext(TableContext)!;
    const tableCtx = tableCtxBase as ITableContext<T>;

    const valProp = props.column.property as keyof typeof props.row;
    const value = props.row[valProp];

    const viewValue = useMemo<string | ReactNode>(() => {
        if (props.column.bodyRenderer) {
            return props.column.bodyRenderer(value, props.row);
        }
        if (value instanceof Date) {
            const dateFormat = props.column.dateFormat ??
                (
                    props.column.dateWithTime ?
                        "dd.MM.yyyy HH:mm:ss" :
                        "dd.MM.yyyy"
                );
            return format(value, dateFormat) as string;
        }
        if (typeof value == "boolean") {
            return value ? "Да" : "Нет";
        }
        if (Array.isArray(value)) {
            return value.join(", ") as string;
        }
        return value as unknown as string;
    }, [value, props.column])

    return (
        <TableCell
            style={{
                //display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                //padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                //paddingRight: i === columns.length - 1 ? 16 : 4,
                //backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                //fontWeight: n.totalRow ? "bold" : "inherit",
                //...((c.options || {}).tdStyle || {})
            }}
        >
            {viewValue}
        </TableCell>
    );
}

export default ItnTableCell;