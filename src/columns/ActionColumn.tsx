import { useEffect, useRef } from "react";
import { ActionColumnProps } from "../types/ColumnProps";
import useColumns from "../providers/TableColumnsProvider/useColumns";

export default function ActionColumn<T>(props: ActionColumnProps<T>) {
    const { 
        name, 
        component, 
        nullValue, 
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
            type: "action",
            name: name,
            component: component,
            disableSorting: true,
            label: label,
            align: align,
            bold: bold ?? false,
            display: display ?? true,
            nullValue: nullValue ?? "-",
            width: width
        });

        registered.current = true;
    }, [columnContext]);

    return null;
}