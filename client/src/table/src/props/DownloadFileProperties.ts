export interface DownloadFileProperties {
    /**
     * Url to api that returns base64 file string or File, default {api}/Download
    */
    url?: string | null;
    /**
     * Name of downloaded file
    */
    name?: string;
    /**
     * Mime-type of downloaded file in case of binary string, default application/csv
    */
    mimeType?: string;
    /**
     * Will be it get response or post with current table state
    */
    useState: boolean;
}