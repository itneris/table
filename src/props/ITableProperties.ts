import { ReactNode } from "react";
import { FilterProperties } from "./FilterProperties";
import { TableState } from "./TableState";
import { TableRef } from "src/types/TableRef";

export type ITableProperties<T> = {
    /**
     * Table rows
    */
    data?: T[];

    /**
     * Total rows count
    */
    total?: number;
    /**
     * Column with unique identifier for rows
     * Default: "id"
    */
    idField?: keyof T;

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
     * Enables columns hide\show functionality
     * Default: false
     * */
    enableHideColumns?: boolean;

    /**
     * Disables table search functionality
     * Default: false
     * */
    disableSearch?: boolean;

    /**
     * Initial state for table, updates on onStateChange
     * Default: ""
    */
    initialState?: TableState;

    /**
     * Return table state when changed
     * Default: null
     * Function params:
     *      TableState:string, current table state
    */
    onStateChange?: (state: TableState) => void;

    /**
     * Filters for table, if empty "Filter" button will not be rendered
     * Default: undefined
    */
    filters?: Array<FilterProperties>;

    /**
     * Disables paging for table
     * Default: false
    */
    disablePaging?: boolean;

    /**
     * Default page size options for table
     * Default: [10, 25, 50, 100]
    */
    pageSizeOptions?: number[];

    /**
     * Enables row selection for table
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
     *      rows: Array<T>, array of currently selected rows
    */
    onRowSelect?: ((rows: Array<T>, selected: boolean) => void) | null;

    /**
     * Callback when row click triggered
     * Default: null
     * Function params:
     *      id: string, clicked row id
     *      row: T, clicked row data
    */
    onRowClick?: ((id: string, row: T) => void) | null;
    /**
     * Save table state in browser local or session storage with defined name
     * Default: null
    */
    saveState?: { type: "session" | "storage", name: string } | null;

    /**
     * If table is server side, data will be fetched from server
     * Default: false
    */
    serverSide?: boolean;
    /**
     * State of table data fetching
     * Default: true
    */
    isSuccess?: boolean;
    /**
     * Is data fetching to show progress
     * Default: false
     */
    isFetching?: boolean;
    /**
     * Error message to show in table when fetching failed
     * Default: false
     */
    isError?: boolean;
    /**
     * Error message to show in table when fetching failed
     * Default: ""
     */
    errorMessage?: string;

    children: ReactNode;
    ref?: React.ForwardedRef<TableRef>;
}