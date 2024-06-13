import React, { ReactNode } from "react";
import { ColumnDescription } from "../base/ColumnDescription";
import { FilterProperties } from "../props/FilterProperties";
import { FilterValueProperties } from "../props/FilterValueProperties";
import { SortProperties } from "../props/SortProperties";

export interface ITableContext<T> {
    idField: keyof T | null;
    dateParseRE: RegExp;

    title: string | null;
    toolbarAdornment: ReactNode | null;
    ctrlIsClicked: boolean;

    searching: string;
    disableSearch: boolean;
    onSearchingChange: ((search: string) => void) | null;

    filters: Array<FilterProperties>;
    filtering?: Array<FilterValueProperties>;
    onFilteringChange: ((sorting: Array<FilterValueProperties>) => void) | null;

    sorting?: Array<SortProperties>;
    onSortingChange: ((sorting: Array<SortProperties>) => void) | null;

    enableHideColumns: boolean;

    pageSize: number;
    pageSizeOptions: number[];
    page: number;
    total: number;

    dispatch: React.Dispatch<any>;

    columns: Array<ColumnDescription<T>>;
    changeColumns: (newColumns: Array<ColumnDescription<T>>) => void;

    onRowClick: ((id: string, row: T) => void) | null;

    selectedRows: Array<string>;
    onRowSelect?: ((rows: Array<T>, selected: boolean) => void) | null;
    enableRowsSelection?: boolean | ((row: any) => boolean);
    rows: Array<T>;

    saveState: { type: "session" | "storage", name: string } | null;

    onDownload: (() => void) | null;
}