import React, { useCallback, useContext, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { FilterValueProperties } from '../props/FilterValueProperties';
import { SET_FILTERS } from './tableReducer';
import { format } from 'date-fns';
import { FilterType } from '../props/FilterType';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

const TablePanelFilterValue = <T,>(props: { filter: FilterValueProperties }) => {
    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const column = useMemo(() => tableCtx.columns.find(tc => tc.property === props.filter.column), [props.filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const deleteFilter = useCallback((value: string) => {
        const filter = props.filter;
        let newFiltering = [...(tableCtx.filtering ?? [])];
        if (filter.type === FilterType.Date) {
            if (filter.startDate != null && filter.endDate != null) {
                newFiltering = newFiltering.map(fd => {
                    if (fd.column !== filter.column) {
                        return fd;
                    } else {
                        return {
                            ...fd,
                            startDate: value === 'start' ? null : fd.startDate,
                            endDate: value === 'end' ? null : fd.endDate
                        } as FilterValueProperties;
                    }
                });
            } else {
                newFiltering = newFiltering.filter(fd => fd.column !== filter.column);
            }
        } else if (filter.type === FilterType.Number) {
            if (filter.min && filter.max) {
                newFiltering = newFiltering.map(fd => {
                    if (fd.column !== filter.column) {
                        return fd;
                    } else {
                        return {
                            ...fd,
                            min: value === 'min' ? null : fd.min,
                            max: value === 'max' ? null : fd.max
                        } as FilterValueProperties;
                    }
                });
            } else {
                newFiltering = newFiltering.filter(fd => fd.column !== filter.column);
            }
        } else if (filter.type === FilterType.Bool) {
            newFiltering = newFiltering.filter(fd => fd.column !== filter.column);
        } else if (newFiltering.find(fd => fd.column === filter.column)?.values?.length === 1) {
            newFiltering = newFiltering.filter(fd => fd.column !== filter.column);
        } else {
            newFiltering = newFiltering.map(fd => {
                if (fd.column !== filter.column) {
                    return fd;
                } else {
                    return {
                        ...fd,
                        values: fd.values?.filter(val => val !== value)
                    } as FilterValueProperties;
                }
            });
        }
        tableCtx.dispatch({ type: SET_FILTERS, filtering: newFiltering });
        tableCtx.onFilteringChange && tableCtx.onFilteringChange(newFiltering);
        saveState(tableCtx.saveState, (state) => {
            state.filtering = newFiltering;
            return state;
        });
    }, [tableCtx.filtering, tableCtx.onFilteringChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const filterRenderer = useMemo(() => {
        const filter = props.filter;

        switch (filter.type) {
            case FilterType.Bool:
                return <Chip
                    label={locale.formatters.bool(filter.checked)}
                    onDelete={() => deleteFilter('true')}
                />;            
            case FilterType.Number:
                return <>
                    {
                        filter.min &&
                        <Chip
                            label={locale.filtering.greaterThanText + " " + filter.min}
                            onDelete={() => deleteFilter('min')}
                        />
                    }
                    {
                        filter.max &&
                        <Chip
                            label={locale.filtering.lessThanText + " " + filter.max}
                            onDelete={() => deleteFilter('max')}
                        />
                    }
                </>;
            case FilterType.Date:
                return <>
                    {
                        filter.startDate &&
                        <Chip
                            label={locale.filtering.laterThanText + " " + locale.formatters.date(new Date(filter.startDate), false)}
                            onDelete={() => deleteFilter('start')}
                        />
                    }
                    {
                        filter.endDate &&
                        <Chip
                        label={locale.filtering.earlierThanText + " " + locale.formatters.date(new Date(filter.endDate), false)}
                            onDelete={() => deleteFilter('end')}
                        />
                    }
                </>
            case FilterType.Select:
                return filter.values!.map((fv, fvInd) =>
                    <Chip
                        key={"col-" + filter.column + "-chip-" + fvInd}
                        label={fv}
                        onDelete={() => deleteFilter(fv)}
                    />
                );
            default: throw Error();
        }
    }, [props.filter, deleteFilter]);

    return (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography variant="body2" color="textSecondary">
                {column ? column.displayName : props.filter.label}:
            </Typography>
            {filterRenderer}
        </Box>
    );
};

export default TablePanelFilterValue;