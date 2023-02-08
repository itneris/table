import { FilterList } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { saveState, TableContext } from './Table';
import TableFilter from './TableFilter';
import { RESET_FILTERS } from './tableReducer';

const TableFilters = () => {
    const tableCtx = useContext(TableContext)!;
    const btn = useRef<HTMLButtonElement | null>(null);

    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    const handleBtnClick = useCallback(() => {
        setFiltersOpen(true);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setFiltersOpen(false);
    }, []);

    const handleResetFilters = useCallback(() => {
        tableCtx.dispatch({ type: RESET_FILTERS });
        tableCtx.onFilteringChange && tableCtx.onFilteringChange([]);
        saveState(tableCtx.saveState, (state) => {
            state.filtering = [];
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>

            <Tooltip title={tableCtx.filterTooltipText}>
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
                componentsProps={{
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
                    <Typography variant="body2">ФИЛЬТРЫ</Typography>
                    <Button
                        variant="text"
                        color="secondary"
                        style={{ fontSize: 12, padding: "6px 8px" }}
                        onClick={handleResetFilters}
                    >
                        {tableCtx.filtersResetText}
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
                                    key={"tab-filt-" + i}
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