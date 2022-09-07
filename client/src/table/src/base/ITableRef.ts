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
     * Gets tablestate: filtering, searching, sorting, paging
     * */
    getState: () => TableState
}
