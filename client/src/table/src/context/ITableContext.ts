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
    resetSearchTooltipText: string;
    searchTooltipText: string;
    onSearchingChange: ((search: string) => void) | null;

    filters: Array<FilterProperties>;
    filtering?: Array<FilterValueProperties>;
    onFilteringChange: ((sorting: Array<FilterValueProperties>) => void) | null;
    filterTooltipText: string;
    filtersResetText: string;
    filtersMinPlaceHolder: string;
    filtersMaxPlaceHolder: string;
    filterClearText: string;
    filterCloseText: string;
    filterOpenText: string;
    filterNoOptionsText: string;
    filterAllText: string;
    filterSelectValuesText: string;
    downloadTooltipText: string;

    sorting?: Array<SortProperties>;
    onSortingChange: ((sorting: Array<SortProperties>) => void) | null;

    hideColumnToolipText: string;
    columnsText: string;
    enableHideColumns: boolean;

    pageSize: number;
    pageSizeOptions: number[];
    pageSizeOptionsText: string;
    page: number;
    total: number;
    pageLabelText: ({ from, to, count }: { from: number, to: number, count: number }) => string;
    prevPageText: string;
    nextPageText: string;

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