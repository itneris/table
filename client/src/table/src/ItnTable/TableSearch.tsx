import React, { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react';
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { TableContext } from './Table';
import { RESET_SEARCH, SEARCH } from './tableReducer';
import { Clear, Search } from '@mui/icons-material';
import { IFocusable } from '../base/IFocusable';

const SEARCH_TIMEOUT = 400;

const TableSearch = forwardRef<IFocusable, { setShowSearch: (show: boolean) => void }>((props, ref) => {
    let searchElement = useRef<HTMLDivElement | null>(null);
    let timer = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
        focus() {
            searchElement.current?.focus();
        }
    }));

    const tableCtx = useContext(TableContext)!;

    const [currentSearch, setCurrentSearch] = useState<string>(tableCtx.searching);

    const resetSearch = useCallback(() => {
        props.setShowSearch(tableCtx.title === null);
        tableCtx.dispatch({ type: RESET_SEARCH });
        tableCtx.onSearchingChange !== null && tableCtx.onSearchingChange("");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchKeyUp = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "onSearchingChange") {
            resetSearch();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        var searchVal = e.currentTarget.value;
        setCurrentSearch(searchVal);
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            tableCtx.dispatch({ type: SEARCH, search: searchVal });
            tableCtx.onSearchingChange && tableCtx.onSearchingChange(searchVal);
        }, SEARCH_TIMEOUT);        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (       
        <Box display="flex" alignItems='center'>
            <TextField
                variant="standard"
                ref={searchElement}
                value={currentSearch}
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: <Search sx={{ color: "rgba(0, 0, 0, 0.54)", marginRight: "8px" }} />
                }}
                size="small"
                //TODO ADD SEARCH INPUT PROPS
                //{...props.searchProps}
            />
            {
                tableCtx.title &&
                <Tooltip title={tableCtx.resetSearchTooltipText}>
                    <IconButton onClick={() => resetSearch()}>
                        <Clear />
                    </IconButton>
                </Tooltip>
            }
        </Box>
    );
});

export default TableSearch;