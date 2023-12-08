import React, { useCallback } from "react";
import { GetApp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTableContext } from "../context/TableContext";

function DownloadButton<T>() {
    const { downloadTooltipText, onDownload } = useTableContext<T>();

    const handleDownload = useCallback(() => {
        onDownload && onDownload();
    }, [onDownload]);

    return <Tooltip title={downloadTooltipText}>
        <IconButton onClick={handleDownload}>
            <GetApp />
        </IconButton>
    </Tooltip>
}

export default DownloadButton;