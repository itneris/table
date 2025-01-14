import { ViewColumn } from '@mui/icons-material';
import { Box, Checkbox, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { useCallback, useContext, useRef, useState } from 'react';
import { ColumnSettings } from '../types/ColumnProps';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';

function sortColumns<T>(a: ColumnSettings<T>, b: ColumnSettings<T>) {
    const nameA = a.label!.toUpperCase();
    const nameB = b.label!.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function TableColumnsHide<T>() {
    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const btn = useRef<HTMLButtonElement | null>(null);

    const [columnsOpen, setColumnsOpen] = useState<boolean>(false);

    const handleBtnClick = useCallback(() => {
        setColumnsOpen(true);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setColumnsOpen(false);
    }, []);

    const handleColumnVisibilityChange = useCallback((column: ColumnSettings<T>) => {
        tableCtx.changeColumns(column.name!, !column.display);
    }, [tableCtx.changeColumns]);

    return (
        <>
            <Tooltip title={locale.visibility.visibilityText}>
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
                        <Typography variant="body2">{locale.visibility.columnsText}</Typography>
                    </Box>
                    {
                        tableCtx.columns
                            .filter(c => !!c.label)
                            .sort(sortColumns)
                            .map((c, i) =>
                                <Box display="flex" alignItems="center" mt="10px" key={"col-hide" + i}>
                                    <Checkbox
                                        color="secondary"
                                        checked={tableCtx.columns.find(col => col.name === c.name)!.display}
                                        onChange={() => handleColumnVisibilityChange(c)}
                                    />
                                    <Box width="275px" ml="16px">
                                        <Typography variant="body2">{c.label}</Typography>
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