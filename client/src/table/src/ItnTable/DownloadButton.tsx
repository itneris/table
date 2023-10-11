import React, { useCallback, useContext } from "react";
import { GetApp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { TableContext } from "./Table";

function DownloadButton() {
    const { downloadTooltipText, onDownload } = useContext(TableContext)!;

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