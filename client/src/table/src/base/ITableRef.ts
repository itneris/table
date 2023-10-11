import { TableState } from "../props/TableState";
import { LooseObject } from "./LooseObject";

/*
 * Interfacle for ItnTable userRef
 * */
export interface ITableRef {
    /*
     * Initialize refetch data when rows changed externally
     * */
    fetch: () => void;
    /*
     * Get currently displayed rows in table
     * */
    getData: () => LooseObject[];
    /*
     * Set currently displayed rows in table
     * */
    setData: React.Dispatch<React.SetStateAction<LooseObject[]>>;
    /*
     * Gets tablestate: filtering, searching, sorting, paging
     * */
    getState: () => TableState;
    /*
     * Sets tablestate: filtering, searching, sorting, paging
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
