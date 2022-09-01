import React, { ReactNode } from "react";
import { ColumnDescription } from "../base/ColumnDescription";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";

export interface ITableContextBase {
    idField: string | null;

    title: string | null;
    toolbarAdornment: ReactNode | null;
    ctrlIsClicked: boolean;

    searching: string;
    disableSearch: boolean;
    resetSearchTooltipText: string;
    searchTooltipText: string;
    onSearchingChange: ((search: string) => void) | null;

    filters: Array<FilterProperties>;
    filtering: Array<FilterValueProperties>;
    onFilteringChange: ((sorting: Array<FilterValueProperties>) => void) | null;
    filterTooltipText: string;
    filtersResetText: string;
    filtersMinPlaceHolder: string;
    filtersMaxPlaceHolder: string;

    sorting: Array<SortProperties>;
    onSortingChange: ((sorting: Array<SortProperties>) => void) | null;

    hideColumnToolipText: string;
    columnsText: string;
    enableHideColumns: boolean;

    pageSize: number;
    page: number;

    dispatch: React.Dispatch<any>;
}

export interface ITableContext<T> extends ITableContextBase {
    columns: Array<ColumnDescription<T>>;
    changeColumns: (newColumns: Array<ColumnDescription<T>>) => void;

    onRowClick: ((id: string, row: T) => void) | null;
}