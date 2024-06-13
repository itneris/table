import { TableCell } from '@mui/material';
import React, { ReactNode, useContext, useMemo } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

function ItnTableCell<T>(props: { row: T, column: ColumnDescription<T> }) {
    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const valProp = props.column.property as keyof typeof props.row;
    const value = props.row[valProp];

    const viewValue = useMemo<string | ReactNode>(() => {
        if (props.column.bodyRenderer) {
            return props.column.bodyRenderer(value, props.row);
        }
        if (typeof value === "string" && tableCtx.dateParseRE.test(value)) {
            return locale.formatters.date(new Date(value), props.column.dateWithTime, props.column.dateFormat);
        }
        if (typeof value == "boolean") {
            return locale.formatters.bool(value)
        }
        if (Array.isArray(value)) {
            return value.length === 0 ? props.column.nullValue : value.join(", ") as string;
        }
        if (value === undefined || value === null || value.toString() === "") {
            return props.column.nullValue;
        }
        return value as unknown as string;
    }, [value, props.column]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TableCell
            style={{
                //display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                //padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                //paddingRight: i === columns.length - 1 ? 16 : 4,
                //backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                //fontWeight: n.totalRow ? "bold" : "inherit",
                //...((c.options || {}).tdStyle || {})
                fontWeight: props.column.bold ? "bold" : undefined
            }}
        >
            {viewValue}
        </TableCell>
    );
}

export default ItnTableCell;