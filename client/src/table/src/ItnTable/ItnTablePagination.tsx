import { TablePagination } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { SET_PAGE, SET_ROWS_PER_PAGE } from './tableReducer';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

function ItnTablePagination<T>() {
    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const handlePageChange = useCallback((page: number) => {
        tableCtx.dispatch({ type: SET_PAGE, page });
        saveState(tableCtx.saveState, (state) => {
            state.page = page;
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const pageSize = parseInt(event.target.value, 10);
        tableCtx.dispatch({ type: SET_ROWS_PER_PAGE, pageSize });
        saveState(tableCtx.saveState, (state) => {
            state.pageSize = pageSize;
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TablePagination
            component="div"
            count={tableCtx.total}
            rowsPerPageOptions={tableCtx.pageSizeOptions}
            rowsPerPage={tableCtx.pageSize}
            labelRowsPerPage={locale.pagination.pageSizeText}
            labelDisplayedRows={locale.pagination.pageLabelText}
            page={tableCtx.page}
            slotProps={{
                actions: {
                    nextButton: { 'aria-label': locale.pagination.nextPageText },
                    previousButton: { 'aria-label': locale.pagination.prevPageText }
                }
            }}
            onPageChange={(_event, page) => handlePageChange(page)}
            onRowsPerPageChange={handlePageSizeChange}
        />
    );
}

export default ItnTablePagination;