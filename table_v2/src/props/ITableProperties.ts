import { QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { LooseObject } from "../base/LooseObject";
import { AbstractColumnBuilder } from "../columnBuilder/AbstractColumnBuilder";
import { DownloadFileProperties } from "./DownloadFileProperties";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";
import { TableState } from "./TableState";

export interface ITableProperties {
    items?: Array<any> | null;

    apiUrl?: string | null;
    queryClient?: QueryClient | null;
    disableQueryFilters?: boolean;
    dateParseRE?: RegExp;

    idField?: string;

    title?: string | null;
    dense?: boolean;

    toolbarAdornment?: ReactNode | null;

    downloadProperties?: DownloadFileProperties | null;

    noDataMessage?: string;
    loadingMessage?: string;
    searchTooltipText?: string;
    restSearchTooltipText?: string;
    filterTooltipText?: string;
    filterText?: string;
    hideColumnToolipText?: string;
    columnsText?: string;
    filtersResetText?: string;
    filtersMinPlaceHolder?: string;
    filtersMaxPlaceHolder?: string;

    enableHideColumns?: boolean;

    disableSearch?: boolean;

    columnsBuilder: AbstractColumnBuilder<LooseObject>;

    /**
     * Initial searching for table, updates on onSearchingChange
    */
    searching?: string;
    /**
     * Return search string, when search triggered
    */
    onSearchingChange?: ((search: string) => void) | null;

    /**
     * Initial sotring for table, updates on onSortingChange
    */
    sorting?: Array<SortProperties>;
    /**
     * Return table current sort properties, when triggered
    */
    onSortingChange?: ((sorting: Array<SortProperties>) => void) | null;

    /**
     * Initial filtering for table, updates on onFilteringChange
    */
    filtering?: Array<FilterValueProperties> ;
    /**
     * Return table current filtering properties, when triggered
    */
    onFilteringChange?: ((sorting: Array<FilterValueProperties>) => void) | null;

    /**
     * Filters for table, no will be rendered if empty
    */
    filters?: Array<FilterProperties> | null;

    /**
     * Disables paging for table
    */
    disablePaging?: boolean;
    pageSize?: number;
    page?: number;

    /**
     * Return current table state when download button clicked if downloadUrl is not set
    */
    onDownload?: ((tableState: TableState) => void) | null;

    selectedRows?: Array<LooseObject> | Array<string>;
    /**
     * Return array of currently selected rows when selection triggered
    */
    onRowSelect?: ((rows: Array<LooseObject>) => void) | null;

    onRowClick?: ((id: string, row: LooseObject) => void) | null;
}