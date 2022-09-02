import React, { ReactNode } from "react";
import { ColumnDescription } from "../base/ColumnDescription";
import { LooseObject } from "../base/LooseObject";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";

export interface ITableContext {
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
    total: number;

    dispatch: React.Dispatch<any>;

    columns: Array<ColumnDescription>;
    changeColumns: (newColumns: Array<ColumnDescription>) => void;

    onRowClick: ((id: string, row: LooseObject) => void) | null;
}