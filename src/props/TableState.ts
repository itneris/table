import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";

export type TableState = {
    searching: string;
    sorting: Array<SortProperties>;
    filtering: Array<FilterValueProperties>;
    page: number;
    pageSize: number;
    selectedRows: Array<string>;
}