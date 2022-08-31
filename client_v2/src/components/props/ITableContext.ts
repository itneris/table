import { ReactNode } from "react";
import { ColumnDescriptionBase } from "../base/ColumnDescription";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";

export interface ITableContext {
    title: string | null;
    toolbarAdornment: ReactNode | null;

    searching: string;
    disableSearch: boolean;
    resetSearchTooltipText: string;
    searchTooltipText: string;
    onSearchingChange: ((search: string) => void) | null;

    filters: Array<FilterProperties>;
    filtering: Array<FilterValueProperties>;
    onFilteringChnage: ((sorting: Array<FilterValueProperties>) => void) | null;

    columns: Array<ColumnDescriptionBase>

    dispatch: React.Dispatch<any>;
}