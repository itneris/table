import React, { ReactNode } from "react";
import { ColumnDescription } from "../base/ColumnDescription";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";

export interface ITableContextBase {
    title: string | null;
    toolbarAdornment: ReactNode | null;

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

    hideColumnToolipText: string;
    columnsText: string;
    enableHideColumns: boolean;

    dispatch: React.Dispatch<any>;
}

export interface ITableContext<T> extends ITableContextBase {
    columns: Array<ColumnDescription<T>>;
    changeColumns: (newColumns: Array<ColumnDescription<T>>) => void;
}