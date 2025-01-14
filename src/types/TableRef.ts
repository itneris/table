import { TableState } from "../props/TableState";

/*
 * Interface for ItnTable userRef
 * */
export type TableRef = {
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
