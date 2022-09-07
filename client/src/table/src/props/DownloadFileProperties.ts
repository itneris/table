export class DownloadFileProperties {
    /**
     * Url to api that returns base64 file string
    */
    url: string;
    /**
     * Name of downloaded file
    */
    name: string;
    /**
     * Mime-type of downloaded file
    */
    mimeType: string;

    /**
     * Initialize file download behavior
     * @param {string} url Url to api that returns base64 file string
     * @param {string} name Name of downloaded file
     * @param {string} mimeType Mime-type of downloaded file, default "application/csv"
     */
    constructor(url: string, name: string, mimeType: string = "application/csv") {
        this.url = url;
        this.name = name;
        this.mimeType = mimeType;
    }
}