import { TablePagination } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';
import { useTableStateContext } from '../context/TableStateContext';

function ItnTablePagination<T>() {
    const tableCtx = useTableContext<T>();
    const tableState = useTableStateContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const handlePageChange = useCallback((page: number) => {
        tableState.onStateChanged(old => ({ ...old, page }));
    }, [tableState.onStateChanged]);

    const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const pageSize = parseInt(event.target.value, 10);
        tableState.onStateChanged(old => ({ ...old, page: 0, pageSize }));
    }, [tableState.onStateChanged]);

    return (
        <TablePagination
            component="div"
            count={tableCtx.total}
            rowsPerPageOptions={tableCtx.pageSizeOptions}
            rowsPerPage={tableState.pageSize}
            labelRowsPerPage={locale.pagination.pageSizeText}
            labelDisplayedRows={locale.pagination.pageLabelText}
            page={tableState.page}
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