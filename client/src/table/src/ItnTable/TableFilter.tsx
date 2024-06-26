import { Autocomplete, Box, Checkbox, FormControlLabel, Radio, TextField, Typography } from '@mui/material';
import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { FilterProperties } from "../props/FilterProperties";
import { FilterType } from '../props/FilterType';
import { FilterValueProperties } from '../props/FilterValueProperties';
import { SET_FILTERS } from './tableReducer';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

function TableFilter<T>(props: { filter: FilterProperties }) {
    const tableCtx = useTableContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const currentFilterValue = useMemo(() => (tableCtx.filtering ?? []).find(f => f.column === props.filter.column) ?? null, [tableCtx.filtering]); // eslint-disable-line react-hooks/exhaustive-deps
    const colName = useMemo(() => tableCtx.columns.find(_ => _.property === props.filter.column)?.displayName, []); // eslint-disable-line react-hooks/exhaustive-deps
    const filterLabel = props.filter.label ?? colName;
    const [autocompleteValue, setAutocompleteValue] = useState<string>("");

    const handleAutocompleteChange = useCallback((e: React.SyntheticEvent, value: string) => {
        setAutocompleteValue(value);
    }, []);

    const changeFilter = useCallback((prop: keyof FilterValueProperties, value: boolean | string | number | Date) => {
        let tableFiltering = [...(tableCtx.filtering ?? [])];
        const currentColumn = props.filter.column;
        if (
            value === "all" ||
            value === "" ||
            value === false ||
            (Array.isArray(value) && tableFiltering.find(f => f.column === currentColumn) && value.includes(""))
        ) {
            tableFiltering = tableFiltering.filter(f => f.column !== currentColumn);
        } else {
            let newFilter = new FilterValueProperties();
            newFilter.column = props.filter.column;
            newFilter.type = props.filter.type;
            newFilter.label = props.filter.label ?? null;

            if (tableFiltering.filter(f => f.column === currentColumn).length > 0) {
                tableFiltering = tableFiltering.map(f => {
                    if (f.column === currentColumn) {
                        if (newFilter.type === FilterType.Bool) {
                            newFilter.checked = value as boolean;
                        } else if (newFilter.type === FilterType.Number) {
                            (newFilter as any)[prop] = value as number;
                        } else if (newFilter.type === FilterType.Date) {
                            (newFilter as any)[prop] = value as Date;
                        } else if (newFilter.type === FilterType.Select) {
                            if (f.values!.includes(value as string)) {
                                newFilter.values = f.values!.filter(val => val !== value);
                            } else {
                                newFilter.values = props.filter.multiple ? [...f.values!, value as string] : [value as string];
                            }
                        }
                        return newFilter;
                    }
                    return f;
                });
            } else {
                if (prop === "values") {
                    newFilter.values = [value as string];
                } else {
                    (newFilter as any)[prop] = value;
                }
                tableFiltering.push(newFilter);
            }
        }

        tableCtx.onFilteringChange && tableCtx.onFilteringChange(tableFiltering);
        tableCtx.dispatch({ type: SET_FILTERS, filtering: tableFiltering });
        saveState(tableCtx.saveState, (state) => {
            state.filtering = tableFiltering;
            return state;
        });
    }, [tableCtx.filtering]);  // eslint-disable-line react-hooks/exhaustive-deps

    let filterRender: ReactNode;
    switch (props.filter.type) {
        case FilterType.Bool:
            filterRender = <FormControlLabel
                control={
                    <Checkbox
                        checked={currentFilterValue ? currentFilterValue.checked! : false}
                        onChange={(e) => changeFilter("checked", e.target.checked)}
                        color="secondary"
                    />
                }
                label={filterLabel}
            />;
            break;
        case FilterType.Number:
            let min: number | null = null,
                max: number | null = null;
            if (currentFilterValue != null) {
                min = currentFilterValue.min ?? null;
                max = currentFilterValue.max ?? null;
            }
            filterRender = <>
                <Typography
                    variant="caption"
                    display="block"
                    sx={{
                        color: 'grey',
                        height: 24,
                        lineHeight: 1
                    }}
                >
                    {filterLabel}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <TextField
                        sx={{ width: 160 }}
                        type="number"
                        value={min}
                        placeholder={locale.filtering.minPlaceholder}
                        inputProps={{ 'min': 0 }}
                        onChange={(e) => changeFilter("min", +e.target.value)}
                    />
                    <TextField
                        style={{ width: 160 }}
                        type="number"
                        value={max}
                        placeholder={locale.filtering.maxPlaceholder}
                        inputProps={{ 'min': 0 }}
                        onChange={(e) => changeFilter("max", +e.target.value)}
                    />
                </Box>
            </>;
            break;
        case FilterType.Date:
            /*let start: Date | null = null,
                end: Date | null = null;
            if (currentFilterValue != null) {
                start = currentFilterValue.startDate;
                end = currentFilterValue.endDate;
            }*/
            filterRender = <>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="caption" display="block" style={{
                        color: 'grey',
                        //height: 24,
                        //lineHeight: 1
                    }}>
                        {filterLabel}
                    </Typography>
                    {/*TODO ADD DATE FILTER
                    <DatePicker
                        placeholder="c"
                        id={"filter-" + filter.column + "-start"}
                        value={start ? start : null}
                        onChange={(value) => {
                            if (value) {
                                props.changeFilter({ name: filter.column, type: "date", start: value, label: filter.label });
                            }
                        }}
                    />
                    <DatePicker
                        placeholder="по"
                        id={"filter-" + filter.column + "-end"}
                        value={end ? end : null}
                        onChange={(value) => {
                            if (value) {
                                props.changeFilter({ name: filter.column, type: "date", end: value, label: filter.label });
                            }
                        }}
                    />*/ }
                </Box>
            </>;
            break;
        case FilterType.Select:
            filterRender =
                <Autocomplete
                    fullWidth
                    disableClearable
                    disableCloseOnSelect
                    options={[locale.filtering.allValuesText, ...props.filter.values!]}
                    autoHighlight
                    value=""
                    getOptionLabel={(option) => option ? option.toString() : ""}
                    isOptionEqualToValue={() => false}
                    componentsProps={{
                        popper: {
                            style: {
                                width: 416
                            }
                        }
                    }}
                    renderOption={(renderProps, option, val) => (
                        <li style={{ display: "flex", alignItems: "center" }} {...renderProps}>
                            {
                                props.filter.multiple ?
                                    option !== locale.filtering.allValuesText &&
                                    <Checkbox
                                        checked={
                                            currentFilterValue === null || currentFilterValue === undefined ? false :
                                                currentFilterValue?.values!.filter(v => v === option).length > 0
                                        }
                                        color="secondary"
                                    /> :
                                    <Radio
                                        checked={
                                            currentFilterValue === null || currentFilterValue === undefined ? false :
                                                currentFilterValue?.values!.filter(v => v === option).length > 0
                                        }
                                        color="secondary"
                                    />
                            }
                            {option}
                        </li>
                    )}
                    onChange={(e, val) => {
                        if (val === "Все" || (currentFilterValue?.values!.length === 1 && currentFilterValue.values.find(v => v === val))) {
                            changeFilter("values", !props.filter.multiple ? "" : "all");
                        } else {
                            changeFilter("values", val);
                        }
                        setAutocompleteValue("");
                    }}
                    inputValue={autocompleteValue}
                    onInputChange={handleAutocompleteChange}
                    noOptionsText={locale.filtering.noOptionsText}
                    clearText={locale.filtering.clearText}
                    closeText={locale.filtering.closeText}
                    openText={locale.filtering.openText}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            label={filterLabel}
                            placeholder={!props.filter.multiple ?
                                currentFilterValue === null ? locale.filtering.allValuesText : currentFilterValue.values![0] :
                                `${locale.filtering.selectValueText}: ${currentFilterValue === null ? locale.filtering.allValuesText : currentFilterValue.values!.length}`
                            }
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'disabled' // disable autocomplete and autofill
                            }}
                        />
                    )}
                />;
            break;
        default: throw new Error();
    }

    return (
        <Box
            width={props.filter.inToolbar ? '350px' : tableCtx.filters.filter(_ => !_.inToolbar).length > 1 ? "calc(50% - 8px)" : undefined}
            flex={props.filter.inToolbar ? undefined : tableCtx.filters.filter(_ => !_.inToolbar).length === 1 ? 1 : undefined}
            ml={props.filter.inToolbar ? "24px" : undefined}
        >
            {filterRender}
        </Box>
    );
}

export default TableFilter;