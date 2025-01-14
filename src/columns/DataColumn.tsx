import { useEffect, useRef } from "react";
import useColumns from "../providers/TableColumnsProvider/useColumns";
import { DataColumnProps } from "../types/ColumnProps";

export default function DataColumn<T>(props: DataColumnProps<T>) {
    const { 
        name, 
        component, 
        nullValue, 
        disableSorting, 
        label,
        width,
        align,
        bold,
        display
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
            type: "data",
            name: name,
            component: component,
            disableSorting: disableSorting ?? false,
            label: label,
            align: align,
            bold: bold ?? false,
            display: display ?? true,
            nullValue: nullValue ?? "-",
            width: width
        });

        registered.current = true;
    }, [columnContext, props]);

    return null;
}