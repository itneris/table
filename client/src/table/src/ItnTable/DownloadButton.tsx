import React, { useCallback, useContext } from "react";
import { GetApp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTableContext } from "../context/TableContext";
import { ItnTableGlobalContext } from "../localization/ItnTableProvider";

function DownloadButton<T>() {
    const { onDownload } = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const handleDownload = useCallback(() => {
        onDownload && onDownload();
    }, [onDownload]);

    return (
        <Tooltip title={locale.download.downloadText}>
            <IconButton onClick={handleDownload}>
                <GetApp />
            </IconButton>
        </Tooltip>
    );
}

export default DownloadButton;