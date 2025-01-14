import { FilterValueProperties } from "../props/FilterValueProperties";
import { SortProperties } from "../props/SortProperties";
import { TableState } from "src/props/TableState";

export type ITableStateContext<T> = {
    searching: string;
    filtering?: Array<FilterValueProperties>;
    sorting?: Array<SortProperties>;
    pageSize: number;
    page: number;

    onStateChanged: (state: React.SetStateAction<TableState>) => void;


    selectedRows: Array<string>;
    onRowSelect?: ((rows: Array<T>, selected: boolean) => void) | null;
}