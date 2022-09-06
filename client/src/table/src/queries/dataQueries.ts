import axios, {  AxiosResponse } from "axios";
import { TableRowsReponse } from "../base/TableRowsReponse";
import { FilterProperties } from "../props/FilterProperties";
import { TableQueryState } from "../props/TableQueryState";

export const getRows = (apiUrl: string, options: TableQueryState) => async (): Promise<AxiosResponse<TableRowsReponse>> => {
    return await axios.post(`${apiUrl}/List`, options);
}

export const getFilters = (apiUrl: string) => async (): Promise<AxiosResponse<Array<FilterProperties>>> => {
    return await axios.get(`${apiUrl}/Filters`);
}