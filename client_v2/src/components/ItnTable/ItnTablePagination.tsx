import { TablePagination } from '@mui/material';
import React, { useContext } from 'react';
import { TableContext } from './Table';
import { SET_PAGE, SET_ROWS_PER_PAGE } from './tableReducer';

function ItnTablePagination(props: { total: number }) {
    const tableCtx = useContext(TableContext)!;

    //TODO RowsPerPageOptions
    //TODO Русские текстовки
    return (
        <TablePagination
            component="div"
            count={props.total}
            rowsPerPageOptions={/*rowsPerPageOptions || */[10, 25, 50, 100]}
            rowsPerPage={tableCtx.pageSize}
            labelRowsPerPage="Строк на странице"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            page={tableCtx.page}
            backIconButtonProps={{ 'aria-label': 'Пред. страница' }}
            nextIconButtonProps={{ 'aria-label': 'След. страница' }}
            onPageChange={(event, page) => tableCtx.dispatch({ type: SET_PAGE, page })}
            onRowsPerPageChange={event => tableCtx.dispatch({ type: SET_ROWS_PER_PAGE, rowsPerPage: event.target.value })}
        />
    );
}

export default ItnTablePagination;