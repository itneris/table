import { ReactNode } from "react";
import { ColumnSettings } from "../types/ColumnProps";
import { FilterProperties } from "../props/FilterProperties";

export type ITableContext<T> = {
    idField: keyof T | null;

    title: string | null;
    toolbarAdornment: ReactNode | null;
    ctrlIsClicked: boolean;

    disableSearch: boolean;

    filters: Array<FilterProperties>;

    enableHideColumns: boolean;

    pageSizeOptions: number[];
    total: number;

    columns: Array<ColumnSettings<T>>;
    changeColumns: (name: string, display: boolean) => void;

    onRowClick: ((id: string, row: T) => void) | null;

    enableRowsSelection?: boolean | ((row: any) => boolean);
    rows: Array<T>;

    saveState: { type: "session" | "storage", name: string } | null;
}