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
    /**
     * Url of api that contains POST {api}/list and GET {api}/filters methods
    */
    apiUrl?: string | null;
    /**
     * Disables calling GET method on server for getting filters
     * Default: false
    */
    disableQueryFilters?: boolean;
    /**
     * RegExp for automatically parse dateTime strings
     * Default: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/
    */
    dateParseRE?: RegExp;

    /**
     * Column with unique identifier for rows
     * Default: "id"
    */
    idField?: string;

    /**
     * Table title, not be rendered if null
     * Default: null
    */
    title?: string | null;
    /**
     * Sets size of padding in table cells to "small"
     * Default: false
    */
    dense?: boolean;

    /**
     * Additional controls in toolbar rendered before search
     * Default: null
    */
    toolbarAdornment?: ReactNode | null;

    /**
     * Return current table state when download button clicked if download file options is not set
     * Default: null
     * Function params:
     *      tableState: TableState, table state with paging, searching, filtering and sorting
    */
    onDownload?: ((tableState: TableState) => void) | null;

    /**
     * Properties that describes behavior when "Download" btn clicked, button will not be rendered if null
     * Default: null
    */
    downloadProperties?: DownloadFileProperties | null;

    /**
     * Message if no rows will be fetched
     * Default: "Нет данных для отображения"
    */
    noDataMessage?: string;
    /**
     * Message while first time rows fetching
     * Default: "Загрузка..."
    */
    loadingMessage?: string;

    /**
     * Tooltip for "Download" button
     * Default: "Скачать"
    */
    downloadTooltipText?: string;

    /**
     * Tooltip for "Search" button
     * Default: "Поиск"
    */
    searchTooltipText?: string;
    /**
     * Tooltip for "Clear" button in search
     * Default: "Сбросить поиск"
    */
    resetSearchTooltipText?: string;
    /**
     * Tooltip for "Filter" button
     * Default: "Фильтры"
    */
    filterTooltipText?: string;
    /**
     * Text in filter popover
     * Default: "Фильтры"
    */
    filterText?: string;
    /**
     * Tooltip for "Columns" button
     * Default: "Отображение колонок"
    */
    hideColumnToolipText?: string;
    /**
     * Text in columns popover
     * Default: "Колонки"
    */
    columnsText?: string;
    /**
     * Tooltip for "Reset filters" button
     * Default: "Сбросить"
    */
    filtersResetText?: string;
    /**
     * Placeholder for min filter
     * Default: "минимум"
    */
    filtersMinPlaceHolder?: string;
    /**
     * Placeholder for max filter
     * Default: "максимум"
    */
    filtersMaxPlaceHolder?: string;

    /**
     * Enables colums hide\show functionality
     * Default: false
     * */
    enableHideColumns?: boolean;

    /**
     * Disables table search functionality
     * Default: false
     * */
    disableSearch?: boolean;

    /**
     * Class with columns description for table
     * */
    columnsBuilder: AbstractColumnBuilder<LooseObject>;

    /**
     * Initial searching for table, updates on onSearchingChange
     * Default: ""
    */
    searching?: string;

    /**
     * Return search string, when search triggered
     * Default: null
     * Function params:
     *      search:string, current table searching
    */
    onSearchingChange?: ((search: string) => void) | null;

    /**
     * Initial sotring for table, updates on onSortingChange
     * Default: []
    */
    sorting?: Array<SortProperties>;

    /**
     * Return table current sort properties, when triggered
     * Default: null
     * Function params:
     *      sorting: Array<SortProperties>, current table sorting
    */
    onSortingChange?: ((sorting: Array<SortProperties>) => void) | null;

    /**
     * Initial filtering for table, updates on onFilteringChange
     * Default: []
    */
    filtering?: Array<FilterValueProperties>;

    /**
     * Return table current filtering properties, when triggered
     * Default: null
     * Function params:
     *      sorting: Array<FilterValueProperties>, current table filtering
    */
    onFilteringChange?: ((sorting: Array<FilterValueProperties>) => void) | null;

    /**
     * Filters for table, if empty "Filter" button will not be rendered
     * Default: null
    */
    filters?: Array<FilterProperties> | null;

    /**
     * Text in autocomplete filters when no options found
     * Default: "Ничего не найдено"
    */
    filterNoOptionsText?: string;

    /**
     * Text for autocomplete reset button
     * Default: "Очистить поиск"
    */
    filterClearText?: string;

    /**
     * Text for autocomplete close button
     * Default: "Свернуть"
    */
    filterCloseText?: string;
    /**
     * Text for autocomplete open button
     * Default: "Развернуть"
    */
    filterOpenText?: string;
    /**
     * Text for autocomplete "All" option
     * Default: "Все"
    */
    filterAllText?: string;
    /**
     * Text for autocomplete "Selected values: <n>"
     * Default: "Выбрано значений"
    */
    filterSelectValuesText?: string;

    /**
     * Disables paging for table
     * Default: false
    */
    disablePaging?: boolean;

    /**
     * Initial page size for table
     * Default: 10
    */
    pageSize?: number;

    /**
     * Default page size options for table
     * Default: [10, 25, 50, 100]
    */
    pageSizeOptions?: number[];

    /**
     * Initial page for table
     * Default: 0
    */
    page?: number;

    /**
     * Text in page size
     * Default: "Строк на странице"
    */
    pageSizeOptionsText?: string;

    /**
     * Text to render in pagination
     * Default: ({ from, to, count }) => `${from}-${to} из ${count}`
    */
    pageLabelText?: ({ from, to, count }: { from: number, to: number, count: number }) => string;

    /**
     * Text for "Previous page" button
     * Default: "Пред. страница"
    */
    prevPageText?: string;
    /**
     * Text for "Next page" button
     * Default: "След. страница"
    */
    nextPageText?: string;

    /**
     * Ebables row selection for table
     * Default: false
    */
    enableRowsSelection?: boolean | ((row: any) => boolean);
    /**
     * Initially selected rows for table, array of rows id
     * Default: null
    */
    selectedRows?: Array<string>;

    /**
     * Return array of currently selected rows when selection triggered
     * Default: null
     * Function params:
     *      rows: Array<LooseObject>, array of currently selected rows
    */
    onRowSelect?: ((rows: Array<string>) => void) | null;

    /**
     * Callback when row click triggered
     * Default: null
     * Function params:
     *      id: string, clicked row id
     *      row: LooseObject, clicked row data
    */
    onRowClick?: ((id: string, row: LooseObject) => void) | null;

    /**
     * Force set query client for table
     * Default: null
    */
    queryClient?: QueryClient | null;

    /**
     * Save table state in browser local or session storage with defined name
     * Default: null
    */
    saveState?: { type: "session" | "storage", name: string } | null;
}