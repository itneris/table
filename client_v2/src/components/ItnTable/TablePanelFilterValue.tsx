import React, { useCallback, useContext, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { TableContext } from './Table';
import { FilterValueProperties, FilterType } from '../props/FilterValueProperties';
import { SET_FILTERS } from './tableReducer';
import { format } from 'date-fns/esm';
import { ITableContext } from '../props/ITableContext';

const TablePanelFilterValue = <T extends unknown>(props: { filter: FilterValueProperties }) => {
    const tableCtxBase = useContext(TableContext)!;
    const tableCtx = tableCtxBase as ITableContext<T>;
    const column = useMemo(() => tableCtx.columns.find(tc => tc.property == props.filter.column), [props.filter]);

    const deleteFilter = useCallback((value: string) => {
        const filter = props.filter;
        let newFiltering = [...tableCtx.filtering];
        if (filter.type == FilterType.Date) {
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
        } else if (filter.type == FilterType.Number) {
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
        tableCtx.dispatch({ type: SET_FILTERS, newFiltering });
        tableCtx.onFilteringChnage && tableCtx.onFilteringChnage(newFiltering);
    }, []);

    const filterRenderer = useMemo(() => {
        const chipStyle = { marginLeft: 8 };
        const filter = props.filter;

        switch (filter.type) {
            case FilterType.Bool:
                return <Chip
                    style={chipStyle}
                    label={filter.checked ? 'Да' : 'Нет'}
                    onDelete={() => deleteFilter('true')}
                />;            
            case FilterType.Number:
                return <>
                    {
                        filter.min &&
                        <Chip
                            style={chipStyle}
                            label={"Больше " + filter.min}
                            onDelete={() => deleteFilter('min')}
                        />
                    }
                    {
                        filter.max &&
                        <Chip
                            style={chipStyle}
                            label={"Меньше " + filter.max}
                            onDelete={() => deleteFilter('max')}
                        />
                    }
                </>;
            case FilterType.Date:
                return <>
                    {
                        filter.startDate &&
                        <Chip
                            style={chipStyle}
                            label={"Позже " + format(new Date(filter.startDate), 'dd.MM.yyyy')}
                            onDelete={() => deleteFilter('start')}
                        />
                    }
                    {
                        filter.endDate &&
                        <Chip
                            style={chipStyle}
                            label={"Раньше " + format(new Date(filter.endDate), 'dd.MM.yyyy')}
                            onDelete={() => deleteFilter('end')}
                        />
                    }
                </>
            case FilterType.Select:
                return filter.values!.map((fv, fvInd) =>
                    <Chip
                        key={"col-" + filter.column + "-chip-" + fvInd}
                        style={chipStyle}
                        label={fv}
                        onDelete={() => deleteFilter(fv)}
                    />
                );
            default: throw Error();
        }
    }, [props.filter]);

    return (
        <Box display="flex" alignItems="center" mr={1} flexWrap="wrap">
            <Typography variant="body2" color="textSecondary">
                {column ? column.displayName : props.filter.label}:
            </Typography>
            {filterRenderer}
        </Box>
    );
};

export default TablePanelFilterValue;