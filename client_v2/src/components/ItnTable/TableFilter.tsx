import { Autocomplete, Box, Checkbox, FormControlLabel, Radio, TextField, Typography } from '@mui/material';
import React, { ReactNode, useContext, useMemo } from 'react';
import { FilterProperties } from "../props/FilterProperties";
import { FilterType } from '../props/FilterType';
import { ITableContext } from '../props/ITableContext';
import { TableContext } from './Table';

//TODO вынести все русские текстовки

function TableFilter<T>(props: { filter: FilterProperties }) {
    const tableCtxBase = useContext(TableContext)!;
    const tableCtx = tableCtxBase as ITableContext<T>;
    const currentFilterValue = useMemo(() => tableCtx.filtering.find(f => f.column === props.filter.column) ?? null, [tableCtx.filtering]);
    const colName = useMemo(() => tableCtx.columns.find(_ => _.property == props.filter.column)!.displayName, []);
    const filterLabel = props.filter.label ?? colName;

    let filterRender: ReactNode;
    switch (props.filter.type) {
        case FilterType.Bool:
            filterRender = <FormControlLabel
                control={
                    <Checkbox
                        checked={currentFilterValue ? currentFilterValue.checked! : false}
                        //onChange={(e) => { props.changeFilter({ name: filter.column, type: "bool", checked: e.target.checked, label: filter.label }); }}
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
                min = currentFilterValue.min;
                max = currentFilterValue.max;
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
                        placeholder={tableCtx.filtersMinPlaceHolder}
                        inputProps={{ 'min': 0 }}
                        onChange={(e) => {
                            //props.changeFilter({ name: filter.column, type: "number", min: e.target.value, label: filter.label });
                        }}
                    />
                    <TextField
                        style={{ width: 160 }}
                        type="number"
                        value={max}
                        placeholder={tableCtx.filtersMaxPlaceHolder}
                        inputProps={{ 'min': 0 }}
                        //onChange={(e) => { props.changeFilter({ name: filter.column, type: "number", max: e.target.value, label: filter.label }); }}
                    />
                </Box>
            </>;
            break;
        case FilterType.Date:
            let start: Date | null = null,
                end: Date | null = null;
            if (currentFilterValue != null) {
                start = currentFilterValue.startDate;
                end = currentFilterValue.endDate;
            }
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
                    style={{ minWidth: 200 }}
                    disableClearable
                    disableCloseOnSelect
                    options={["Все", ...props.filter.values]}
                    autoHighlight
                    //value={[]}
                    getOptionLabel={(option) => option ? option.toString() : ""}
                    isOptionEqualToValue={() => false}
                    renderOption={(renderProps, option, { selected }) => (
                        //<Box display="flex" alignItems="center" justifyContent="space-between" {...renderProps}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            {
                                props.filter.multiple ?
                                    option !== "Все" &&
                                    <Checkbox
                                        checked={(currentFilterValue?.values!.some(v => v === option) ?? false)}
                                        color="secondary"
                                    /> :
                                    <Radio
                                        checked={(currentFilterValue?.values!.some(v => v === option) ?? false)}
                                        color="secondary"
                                    />
                            }
                            {option}
                        </Box>
                    )}
                    /*onChange={(e, val) => {
                        if ((val && val === "Все") || (currentFilter && currentFilter.value.length === 1 && currentFilter.value.find(v => v === val))) {
                            props.changeFilter({ name: filter.column, value: !multiFilter ? "" : "all", label: filter.label });
                        } else {
                            val && props.changeFilter({ name: filter.column, value: val, label: filter.label });
                        }
                    }}*/
                    noOptionsText="Ничего не найдено"
                    clearText="Очистить поиск"
                    closeText="Свернуть"
                    openText="Развернуть"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            label={filterLabel}
                            placeholder={!props.filter.multiple ?
                                currentFilterValue === null ? "Все" : currentFilterValue.values![0] :
                                `Выбрано значений: ${currentFilterValue === null ? "Все" : currentFilterValue.values!.length}`
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

    return <Box
        width={props.filter.inToolbar ? '350px' : 'calc(50% - 16px)'}
        mb="16px"
        ml={props.filter.inToolbar ? "24px" : "16px"}
    >
        {filterRender}
    </Box>
}

export default TableFilter;