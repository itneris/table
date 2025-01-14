import { FilterList } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { useCallback, useContext, useRef, useState } from 'react';
import TableFilter from './TableFilter';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';
import { useTableStateContext } from '../context/TableStateContext';

const TableFilters = <T,>() => {
    const tableCtx = useTableContext<T>();
    const tableState = useTableStateContext<T>();

    const { locale } = useContext(ItnTableGlobalContext);

    const btn = useRef<HTMLButtonElement | null>(null);

    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    const handleBtnClick = useCallback(() => {
        setFiltersOpen(true);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setFiltersOpen(false);
    }, []);

    const handleResetFilters = useCallback(() => {
        tableState.onStateChanged(old => ({ ...old, filtering: [] }));
    }, [tableState.onStateChanged]);

    return (
        <>

            <Tooltip title={locale.filtering.filterTooltipText}>
                <IconButton
                    ref={btn}
                    onClick={handleBtnClick}
                >
                    <FilterList />
                </IconButton>
            </Tooltip>

            <Popover
                anchorEl={btn.current}
                open={filtersOpen}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                slotProps={{
                    root: {
                        style: {
                            padding: 16,
                            maxWidth: 800,
                            minWidth: 200
                        }
                    }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Typography variant="body2">{locale.filtering.filterText}</Typography>
                    <Button
                        variant="text"
                        color="secondary"
                        style={{ fontSize: 12, padding: "6px 8px" }}
                        onClick={handleResetFilters}
                    >
                        {locale.filtering.resetText}
                    </Button>
                </Box>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                    px={2}
                    pb={2}
                    minWidth={tableCtx.filters.filter(_ => !_.inToolbar).length === 1 ? 208 : 416}
                >
                    {
                        tableCtx.filters.filter(f => !f.inToolbar)
                            .map((filter, i) =>
                                <TableFilter
                                    key={"tab-filter-" + i}
                                    filter={filter}
                                />
                            )
                    }
                </Box>
            </Popover>
        </>
    );
};

export default TableFilters;