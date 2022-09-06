export class DownloadFileProperties {
    url: string;
    name: string;
    mimeType: string;

    constructor(url: string, name: string, mimeType: string = "application/csv") {
        this.url = url;
        this.name = name;
        this.mimeType = mimeType;
    }
}