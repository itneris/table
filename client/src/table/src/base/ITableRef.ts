import { TableState } from "../props/TableState";
import { LooseObject } from "./LooseObject";

export interface ITableRef {
    fetch: () => void;
    getData: () => LooseObject[];
    getState: () => TableState
}
