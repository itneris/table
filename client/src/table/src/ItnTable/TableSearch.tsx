import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { RESET_SEARCH, SEARCH } from './tableReducer';
import { Clear, Search } from '@mui/icons-material';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

const SEARCH_TIMEOUT = 400;

declare module "react" {
    function forwardRef<T,P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

function TableSearchInner<T>(props: { setShowSearch: (show: boolean) => void }, ref: React.Ref<HTMLDivElement>) {
    let timer = useRef<NodeJS.Timeout | null>(null);

    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const [currentSearch, setCurrentSearch] = useState<string>("");

    useEffect(() => {
        setCurrentSearch(tableCtx.searching);
    }, [tableCtx.searching])

    const resetSearch = useCallback(() => {
        props.setShowSearch(tableCtx.title === null);
        tableCtx.dispatch({ type: RESET_SEARCH });
        tableCtx.onSearchingChange !== null && tableCtx.onSearchingChange("");
        saveState(tableCtx.saveState, (state) => {
            state.searching = "";
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchKeyUp = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "onSearchingChange") {
            resetSearch();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const searchVal = e.currentTarget.value;
        setCurrentSearch(searchVal);
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            tableCtx.dispatch({ type: SEARCH, searching: searchVal });
            tableCtx.onSearchingChange && tableCtx.onSearchingChange(searchVal);
            saveState(tableCtx.saveState, (state) => {
                state.searching = searchVal;
                return state;
            });
        }, SEARCH_TIMEOUT);        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (       
        <Box display="flex" alignItems='center'>
            <TextField
                variant="standard"
                ref={ref}
                value={currentSearch}
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: <Search sx={{ opacity: 0.54, mr: 2 }} />
                }}
                size="small"
                autoComplete="off"
                name="t-search"
                //TODO ADD SEARCH INPUT PROPS
                //{...props.searchProps}
            />
            {
                tableCtx.title &&
                <Tooltip title={locale.search.resetText}>
                    <IconButton onClick={() => resetSearch()}>
                        <Clear />
                    </IconButton>
                </Tooltip>
            }
        </Box>
    );
};

const TableSearch = React.forwardRef(TableSearchInner);
export default TableSearch;