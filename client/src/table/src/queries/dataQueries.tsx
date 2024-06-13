import axios, { AxiosResponse } from "axios";
import { TableRowsResponse } from "../base/TableRowsResponse";
import { DownloadFileProperties } from "../props/DownloadFileProperties";
import { FilterProperties } from "../props/FilterProperties";
import { TableQueryState } from "../props/TableQueryState";

export function getRows<T>(apiUrl: string, options: TableQueryState, changeRows?: (row: T) => T) {
    async function fetchRows() {
        const response = await axios.post(`${apiUrl}/list`, options);
        const data = response.data as TableRowsResponse<T>;
        if (changeRows) {
            data.rows = data.rows.map(changeRows);
        }

        return data;
    };

    return fetchRows;
}

export const getFilters = (apiUrl: string) => async () => {
    const response = await axios.get(`${apiUrl}/filters`);
    return response.data as Array<FilterProperties>;
}

export interface DownloadParams {
    url: string,
    downloadProperties: DownloadFileProperties,
    state: TableQueryState
}

export async function getFileFromServer(params: DownloadParams): Promise<File> {
    let url = params.downloadProperties.url ?? `${params.url}/Download`;

    let response: AxiosResponse;
    if (!params.downloadProperties.useState) {
        response = await axios.get(url);
    } else {
        response = await axios.post(url, params.state);
    }

    if (response.data instanceof File) {
        return response.data as File;
    }

    let base64str = response.data as string;
    // decode base64 string, remove space for IE compatibility
    var binary = window.atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([view], { type: params.downloadProperties.mimeType ?? "application/csv" });
    const file = new File([blob], params.downloadProperties.name ?? "Экспорт");
    return file;
}