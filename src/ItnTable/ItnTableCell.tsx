import { TableCell } from '@mui/material';
import { ReactNode, useContext, useMemo } from 'react';
import { ColumnSettings } from '../types/ColumnProps';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';

function ItnTableCell<T>(props: { row: T, column: ColumnSettings<T> }) {
    const { locale } = useContext(ItnTableGlobalContext);
    const { column, row } = props;

    const valProp = column.name as keyof typeof row;
    const value = row[valProp];
 
    const viewValue = useMemo<string | ReactNode>(() => {
        if ((column.type === "action" || column.type === "data") && column.component) {
            return column.component(value, row);
        }
        if (column.type === "date" || column.type === "datetime") {
            return locale.formatters.date(new Date(value as string), column.type === "datetime", column.dateFormat);
        }
        if (column.type === "bool") {
            return locale.formatters.bool(value as boolean)
        }
        if (Array.isArray(value)) {
            return value.length === 0 ? column.nullValue : value.join(", ") as string;
        }
        if (value === undefined || value === null || value.toString() === "") {
            return column.nullValue;
        }
        return value as unknown as string;
    }, [value, column]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TableCell
            style={{
                //display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                //padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                //paddingRight: i === columns.length - 1 ? 16 : 4,
                //backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                //fontWeight: n.totalRow ? "bold" : "inherit",
                //...((c.options || {}).tdStyle || {})
                fontWeight: column.bold ? "bold" : undefined
            }}
        >
            {viewValue}
        </TableCell>
    );
}

export default ItnTableCell;