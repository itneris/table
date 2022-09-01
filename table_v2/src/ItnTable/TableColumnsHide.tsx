import { ViewColumn } from '@mui/icons-material';
import { Box, Checkbox, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { TableContext } from './Table';

function sortColumns(a: ColumnDescription, b: ColumnDescription) {
    const nameA = a.displayName.toUpperCase();
    const nameB = b.displayName.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function TableColumnsHide() {
    const tableCtx = useContext(TableContext)!;
    const btn = useRef<HTMLButtonElement | null>(null);

    const [columnsOpen, setColumnsOpen] = useState<boolean>(false);

    const handleBtnClick = useCallback(() => {
        setColumnsOpen(true);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setColumnsOpen(false);
    }, []);

    const handleColumnVisibilityChange = useCallback((column: ColumnDescription) => {
        const newColumns = tableCtx.columns.map(c => {
            if (c.property === column.property) {
                return {
                    ...c,
                    display: !c.display
                };
            } else {
                return c;
            }
        });
        tableCtx.changeColumns(newColumns);
    }, [tableCtx.columns]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Tooltip title={tableCtx.hideColumnToolipText}>
                <IconButton ref={btn} onClick={handleBtnClick}>
                    <ViewColumn />
                </IconButton>
            </Tooltip>

            <Popover
                anchorEl={btn.current}
                open={columnsOpen}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
            >
                <Box p={2} maxHeight={400} maxWidth={800} minWidth={200}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{tableCtx.columnsText}</Typography>
                    </Box>
                    {
                        tableCtx.columns
                            .filter(c => !c.systemHide)
                            .sort(sortColumns)
                            .map((c, i) =>
                                <Box display="flex" alignItems="center" mt="10px" key={"col-hide" + i}>
                                    <Checkbox
                                        color="secondary"
                                        checked={tableCtx.columns.find(col => col.property === c.property)!.display}
                                        onChange={() => handleColumnVisibilityChange(c)}
                                    />
                                    <Box width="275px" ml="16px">
                                        <Typography variant="body2">{c.displayName}</Typography>
                                    </Box>
                                </Box>
                            )
                    }
                </Box>
            </Popover>
        </>
    );
};

export default TableColumnsHide;