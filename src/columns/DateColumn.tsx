import { useEffect, useRef } from "react";
import useColumns from "../providers/TableColumnsProvider/useColumns";
import { DateColumnProps } from "../types/ColumnProps";

export default function DateColumn<T>(props: DateColumnProps) {
    const { 
        name, 
        nullValue, 
        disableSorting, 
        label,
        width,
        align,
        bold,
        display,
        withTime,
        dateFormat
    } = props;

    const registered = useRef(false);

    const columnContext = useColumns<T>();

    useEffect(() => {
        if (registered.current) {
            return;
        }

        if (!columnContext) {
            throw new Error("DataColumn must be used within a ItnTable component");
        }

        columnContext.registerColumn({
            type: withTime ? "datetime" : "date",
            name: name,
            disableSorting: disableSorting ?? false,
            label: label,
            align: align,
            bold: bold ?? false,
            display: display ?? true,
            nullValue: nullValue ?? "-",
            width: width,
            dateFormat: dateFormat
        });

        registered.current = true;
    }, [columnContext, props]);

    return null;
}