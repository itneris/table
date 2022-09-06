import { FilterValueProperties } from "./FilterValueProperties";
import { SortProperties } from "./SortProperties";

export class TableQueryState {
    searching: string = "";
    sorting: Array<SortProperties> = [];
    filtering: Array<FilterValueProperties> = [];
    page: number = 1;
    pageSize: number = 25;
}