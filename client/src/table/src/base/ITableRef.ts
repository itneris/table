import { TableState } from "../props/TableState";

/*
 * Interface for ItnTable userRef
 * */
export interface ITableRef<T> {
    /*
     * Initialize refetch data when rows changed externally
     * */
    fetch: () => void;
    /*
     * Get currently displayed rows in table
     * */
    getData: () => T[];
    /*
     * Set currently displayed rows in table
     * */
    setData: (rows: T[]) => void;
    /*
     * Gets table state: filtering, searching, sorting, paging
     * */
    getState: () => TableState;
    /*
     * Sets table state: filtering, searching, sorting, paging
     * */
    setState: (state: TableState) => void;
    /*
     * Gets currently selected rows ids
     * */
    getSelectedRows: () => string[];
    /*
     * Reset current selection and set new ids
     * */
    setSelectedRows: (ids: string[]) => void;
    /*
     * Clears all selected rows
     * */
    resetSelection: () => void;
}
