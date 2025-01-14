import { useEffect, useRef } from "react";
import useColumns from "../providers/TableColumnsProvider/useColumns";
import { BoolColumnProps } from "../types/ColumnProps";

export default function BoolColumn<T>(props: BoolColumnProps) {
    const { 
        name, 
        nullValue, 
        label,
        width,
        align,
        bold,
        display,
        showText
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
            type: "bool",
            name: name,
            disableSorting: true,
            label: label,
            align: align,
            bold: bold ?? false,
            display: display ?? true,
            nullValue: nullValue ?? "-",
            width: width,
            showText: showText ?? true
        });

        registered.current = true;
    }, [columnContext, props]);

    return null;
}