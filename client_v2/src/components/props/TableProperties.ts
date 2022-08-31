import { ReactNode } from "react";
import { AbstractColumnBuilder } from "../columnBuilder/AbstractColumnBuilder";
import { DownloadFileProperties } from "./DownloadFileProperties";
import { FilterProperties } from "./FilterProperties";
import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";
import { TableState } from "./TableState";

export class TableProperties<T> {
    items: Array<T> | null = null;

    apiUrl: string | null = null;
    useReactQuery: boolean = true;

    idField: string | null = null;

    title: string | null = null;

    toolbarAdornment: ReactNode | null = null;

    downloadProperties: DownloadFileProperties | null = null;

    noDataMessage: string = "Нет данных для отображения";
    loadingMessage: string = "Загрузка...";
    searchTooltipText: string = "Поиск";
    restSearchTooltipText: string = "Сбросить поиск";
    filterTooltipText: string = "Фильтры";
    filterText: string = "Фильтры";
    hideColumnToolipText: string = "Отображение колонок";
    columnsText: string = "Колонки";
    filtersResetText: string = "Сбросить";
    filtersMinPlaceHolder: string = "минимум";
    filtersMaxPlaceHolder: string = "максимум";

    enableHideColumns: boolean = false;

    disableSearch: boolean = false;

    columnsBuilder!: AbstractColumnBuilder<T>;

    /**
     * Initial searching for table, updates on onSearchingChange
    */
    searching: string = "";
    /**
     * Return search string, when search triggered
    */
    onSearchingChange: ((search: string) => void) | null = null;

    /**
     * Initial sotring for table, updates on onSortingChange
    */
    sorting: Array<SortProperties> = [];
    /**
     * Return table current sort properties, when triggered
    */
    onSortingChange: ((sorting: Array<SortProperties>) => void) | null = null;

    /**
     * Initial filtering for table, updates on onFilteringChange
    */
    filtering: Array<FilterValueProperties> = [];
    /**
     * Return table current filtering properties, when triggered
    */
    onFilteringChange: ((sorting: Array<FilterValueProperties>) => void) | null = null;

    /**
     * Filters for table, no will be rendered if empty
    */
    filters: Array<FilterProperties> | null = null;

    /**
     * Disables paging for table
    */
    disablePaging: boolean = false;
    pageSize: number = 10;
    page: number = 1;

    /**
     * Return current table state when download button clicked if downloadUrl is not set
    */
    onDownload: ((tableState: TableState) => void) | null = null;

    selectedRows: Array<T> | Array<string> = [];
    /**
     * Return array of currently selected rows when selection triggered
    */
    onRowSelect: ((rows: Array<T>) => void) | null = null;

    onRowClick: ((id: string, row: T) => void) | null = null;
}