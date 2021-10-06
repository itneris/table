import React, { useReducer, useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
    Paper,
    Button,
    TableCell,
    TableBody,
    TableHead,
    Table,
    TableRow,
    TableSortLabel,
    TablePagination,
    Typography,
    Toolbar,
    Icon,
    TextField,
    IconButton,
    Popover,
    Chip,
    Box,
    Checkbox,
    FormControlLabel,
    Radio,
    Badge,
    Menu,
    MenuItem,
    Popper
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    FilterList,
    Search,
    Clear,
    GetApp,
    ViewColumn,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { HttpUtil, CreateFile } from './utils';
import moment from 'moment';

const rowCount = 25;
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

function HeadCell(props) {
    let { column, classes, sorted, sort, small, sortIndex, sections } = props;
    let sortDir = sorted ? sorted.dir : undefined;
    const options = useMemo(() => column.options || {}, [column]);
    const columnRender = useMemo(
        () => options.customHeadRender ? options.customHeadRender(classes) : column.label,
        [column.label, options, classes]
    );

    return <TableCell
        align="left"
        key={column.name}
        style={{
            ...(options.customHeadStyle || {}),
            padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
            display: (options.section && !sections[options.section].expanded) ? "none" : null,
            zIndex: 1
        }}
        rowSpan={options.rowSpan}
        colSpan={options.colSpan}>
        {
            (options.sort !== false && !options.onlyHead) ?
                <Badge
                    badgeContent={isNaN(sortIndex + 1) ? "" : (sortIndex + 1)}
                    invisible={sortIndex === undefined || sortIndex === -1}
                >
                    <TableSortLabel
                        active={!!sorted}
                        direction={sortDir}
                        onClick={() => sort(sorted, column.name)}
                    >
                        {columnRender}
                    </TableSortLabel>
                </Badge> :
                columnRender
        }
    </TableCell>;
}

function Filter(props) {
    let { c, filter, multiFilter, currentFilter, classes } = props;
    let start = '';
    let end = '';
    let min = '';
    let max = '';
    if (filter) {
        let filterRender;
        switch (filter.type) {
            case "bool":
                filterRender = <FormControlLabel
                    control={
                        <Checkbox
                            key={"filter-key-" + filter.column}
                            id={"filter-" + filter.column}
                            checked={currentFilter ? currentFilter.checked : false}
                            onChange={(e) => { props.changeFilter({ name: filter.column, type: "bool", checked: e.target.checked, label: filter.label }); }}
                            color="secondary"
                        />
                    }
                    label={c ? c.label : filter.label}
                />;
                break;
            case "number":
                if (currentFilter != null) {
                    min = currentFilter.min;
                    max = currentFilter.max;
                }
                filterRender = <>
                    <Typography variant="caption" display="block" style={{
                        color: 'grey',
                        height: 24,
                        lineHeight: 1
                    }}>
                        {c ? c.label : filter.label}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                        <TextField
                            style={{ width: 160 }}
                            id={"filter-" + filter.column + "-min"}
                            type="number"
                            value={min}
                            placeholder="минимум"
                            inputProps={{ 'min': 0 }}
                            onChange={(e) => { props.changeFilter({ name: filter.column, type: "number", min: e.target.value, label: filter.label }); }}
                        />
                        <TextField
                            style={{ width: 160 }}
                            id={"filter-" + filter.column + "-max"}
                            type="number"
                            value={max}
                            placeholder="максимум"
                            inputProps={{ 'min': 0 }}
                            onChange={(e) => { props.changeFilter({ name: filter.column, type: "number", max: e.target.value, label: filter.label }); }}
                        />
                    </Box>
                </>;
                break;
            case "date":
                if (currentFilter != null) {
                    start = currentFilter.start;
                    end = currentFilter.end;
                }
                filterRender = <>
                    <Typography variant="caption" display="block" style={{
                        color: 'grey',
                        height: 24,
                        lineHeight: 1
                    }}>
                        {c ? c.label : filter.label}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                        <KeyboardDatePicker
                            id={"filter-" + filter.column + "-start"}
                            style={{ marginRight: 24 }}
                            fullWidth
                            disableToolbar
                            autoOk
                            maxDate={new Date('2077-01-01')}
                            maxDateMessage={`Значение даты не должно превышать 01.01.2077`}
                            minDateMessage='Слишком маленькое значение даты'
                            invalidDateMessage='Некорректная дата'
                            okLabel="ОК"
                            cancelLabel="Отмена"
                            format={'DD.MM.YYYY'}
                            placeholder="с"
                            value={start ? start : null}
                            onChange={(value) => {
                                value && value.isValid() && value.year() !== 0 &&
                                    props.changeFilter({ name: filter.column, type: "date", start: value.format("YYYY-MM-DD"), label: filter.label });
                            }}
                        />
                        <KeyboardDatePicker
                            id={"filter-" + filter.column + "-end"}
                            fullWidth
                            disableToolbar
                            autoOk
                            maxDate={new Date('2077-01-01')}
                            maxDateMessage={`Значение даты не должно превышать 01.01.2077`}
                            minDateMessage='Слишком маленькое значение даты'
                            invalidDateMessage='Некорректная дата'
                            okLabel="ОК"
                            cancelLabel="Отмена"
                            format={'DD.MM.YYYY'}
                            placeholder="по"
                            value={end ? end : null}
                            onChange={(value) => {
                                value && value.isValid() && value.year() !== 0 &&
                                    props.changeFilter({ name: filter.column, type: "date", end: value.format("YYYY-MM-DD"), label: filter.label });
                            }}
                        />
                    </Box>
                </>;
                break;
            default:
                filterRender = <Autocomplete
                    classes={{ inputRoot: classes.inputRoot }}
                    style={{ minWidth: 200 }}
                    disableClearable
                    disableCloseOnSelect
                    options={["Все", ...filter.value]}
                    autoHighlight
                    value={[]}
                    getOptionLabel={(option) => option ? option.toString() : ""}
                    renderOption={(option) => <>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            {
                                multiFilter ?
                                    option !== "Все" &&
                                    <Checkbox
                                        key={"filter-key-" + filter.column}
                                        id={"filter-" + filter.column}
                                        checked={currentFilter ? !!currentFilter.value.find(v => v === option) : false}
                                        color="secondary"
                                    /> :
                                    <Radio
                                        key={"filter-key-" + filter.column}
                                        id={"filter-" + filter.column}
                                        checked={currentFilter ? !!currentFilter.value.find(v => v === option) : option === "Все"}
                                        color="secondary"
                                    />
                            }
                            {option}
                        </Box>
                    </>}
                    onChange={(e, val) => {
                        if ((val && val === "Все") || (currentFilter && currentFilter.value.length === 1 && currentFilter.value.find(v => v === val))) {
                            props.changeFilter({ name: filter.column, value: !multiFilter ? "" : "all", label: filter.label });
                        } else {
                            val && props.changeFilter({ name: filter.column, value: val, label: filter.label });
                        }
                    }}
                    noOptionsText="Ничего не найдено"
                    clearText="Очистить поиск"
                    closeText="Свернуть"
                    openText="Развернуть"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label={c ? c.label : filter.label}
                            placeholder={!multiFilter ?
                                currentFilter === undefined ? "Все" : currentFilter.value[0] :
                                `Выбрано значений: ${currentFilter === undefined ? "Все" : currentFilter.value.length}`
                            }
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'disabled' // disable autocomplete and autofill
                            }}
                        />
                    )}
                />;
        }
        return <Box
            id={"filter-" + filter.column}
            key={"filter-key-" + filter.column}
            width={filter.inToolbar ? '350px' : 'calc(50% - 16px)'}
            mb="16px"
            ml={filter.inToolbar ? "24px" : "16px"}
        >
            {filterRender}
        </Box>
    } else {
        return null;
    }
}


function SortData(sort, columns) {
    var fields = [].slice.call(sort.map(s => ({
        name: s.column,
        reverse: s.dir === "desc",
        transformData: ((columns.find(c => c.name === s.column) || {}).options || {}).transformData
    }))),
        n_fields = sort.length;

    return function (A, B) {
        var a, b, field, key, reverse, result;
        for (var i = 0, l = n_fields; i < l; i++) {
            result = 0;
            field = fields[i];

            key = typeof field === 'string' ? field : field.name;
            var aVal = A[key];
            var bVal = B[key];

            if (field.transformData) {
                aVal = field.transformData(aVal, A);
                bVal = field.transformData(bVal, B);
            }

            a = isNaN(Date.parse(aVal)) ? aVal || "" : Date.parse(aVal);
            b = isNaN(Date.parse(bVal)) ? bVal || "" : Date.parse(bVal);

            if (typeof field.primer !== 'undefined') {
                a = field.primer(a);
                b = field.primer(b);
            }

            reverse = (field.reverse) ? -1 : 1;

            if (a < b) result = reverse * -1;
            if (a > b) result = reverse * 1;
            if (result !== 0) break;
        }
        return result;
    }
}

const RESET_SEARCH = 'RESET_SEARCH_ACTION';
const SEARCH = 'SEARCH_ACTION';
const SET_SELECT = 'SET_SELECT_ACTION';
const RESET_FILTERS = 'RESET_FILTERS_ACTION';
const SET_FILTERS = 'SET_FILTERS_ACTION';
const SET_SORT = 'SET_SORT_ACTION';
const SET_SECTIONS = 'SET_SECTIONS_ACTION';
const SET_SELECTED_ROWS = 'SET_SELECTED_ROWS_ACTION';
const RESET_SELECTED_ROWS = 'RESET_SELECTED_ROWS_ACTION';
const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE_ACTION';
const SET_PAGE = 'SET_PAGE_ACTION';
function tableReducer(state, action) {
    switch (action.type) {
        case RESET_SEARCH:
            return {
                ...state,
                search: "",
                page: 0
            };
        case SEARCH:
            return {
                ...state,
                search: action.search,
                page: 0
            };
        case SET_SELECT:
            return {
                ...state,
                selectedRows: action.selectedRows
            };
        case SET_FILTERS:
            return {
                ...state,
                filters: action.filters,
                page: 0
            };
        case RESET_FILTERS:
            return {
                ...state,
                filters: [],
                page: 0
            };
        case SET_SORT:
            return {
                ...state,
                sort: action.sort
            };
        case SET_SECTIONS:
            return {
                ...state,
                sections: action.sections
            };
        case SET_SELECTED_ROWS:
            return {
                ...state,
                selectedRows: action.selectedRows
            };
        case RESET_SELECTED_ROWS:
            return {
                ...state,
                selectedRows: []
            };
        case SET_ROWS_PER_PAGE:
            return {
                ...state,
                rowsPerPage: action.rowsPerPage,
                page: 0
            };
        case SET_PAGE:
            return {
                ...state,
                page: action.page
            };
        default:
            throw new Error();
    }
}

/*const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }

    useEffect(effectHook, dependencies);
};*/

const NerisTable = forwardRef((props, ref) => {
    let menuButtonElement = useRef(null);
    let sectionsButtonElement = useRef(null);
    let searchElement = useRef(null);
    const classes = useStyles();

    const {
        showLoader,
        stopLoader,
        data,
        filtersWithData,
        search: propSearch,
        sort: propSort,
        filters: propFilters,
        filterList,
        downloadWithFilters,
        searchColumns: propSearchColumns,
        disablePaging,
        columns,
        onSearchChanged,
        onSortingChanged,
        onFilterChanged,
        onDownload,
        onRowSelect,
        onRowClick,
        title,
        stickyHeader,
        selectedRows: propSelectedRows,
        multiFilter,
        idField: propIdField,
        headRows: propHeadRows,
        customToolbar,
        mimeType,
        downloadName,
        overflow,
        maxHeight,
        minWidth,
        small,
        showRowNums,
        showColNums,
        noDataMessage,
        color,
        stripedRows,
        totalRow,
        rowsPerPageOptions,
        disableSearch,
        disableToken,
        context
    } = props;

    const [showSearch, setShowSearch] = useState(title ? !!propSearch : true);
    const [sectionsOpen, setSectionsOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [ctrlIsClicked, setCtrlIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState([]);
    const [total, setTotal] = useState(0);
    const [openTotals, setOpenTotals] = useState([]);
    const [contextOptions, setContextOptions] = useState(null);

    const [table, dispatch] = useReducer(tableReducer, {
        rowsPerPage: props.rowCount || rowCount,
        page: props.page || 0,
        search: propSearch || "",
        sort: propSort || [],
        filters: propFilters || [],
        sections: props.sections,
        selectedRows: props.selectedRows || []
    });

    const displayColumns = useMemo(() => columns.filter(c => !c.options || c.options.display !== false), [columns]);
    const idField = useMemo(() => propIdField || "id", [propIdField]);
    const headRows = useMemo(() => {
        let returnHeadRows = [];
        if (propHeadRows > 1) {
            for (let i = 1; i <= propHeadRows; i++) {
                returnHeadRows.push(columns.filter(c => c.options && c.options.headRow === i));
            }
        }
        return returnHeadRows;
    }, [propHeadRows, columns]);

    async function fetchServer() {
        showLoader && showLoader();
        let options = {
            rowsPerPage: table.rowsPerPage,
            page: table.page,
            search: table.search,
            sort: table.sort,
            filters: table.filters
        };
        var rowData = await HttpUtil.fetchAsync(data, options, "POST", disableToken ? true : false);
        setIsLoading(false);
        setRows(rowData.rows);
        setTotal(rowData.total);
        if (filtersWithData) {
            setFilters(rowData.filtersData);
        }
        stopLoader && stopLoader();
    }

    useImperativeHandle(ref, () => ({
        fetch() {
            fetchServer();
        },
        getData() {
            return rows;
        },
        transformData(data) {
            setRows(data)
        }
    }));

    //useEffectDebugger(() => {
    useEffect(() => {
        if (typeof (data) === "string") {
            fetchServer();
        } else {
            let rows = [...data];
            let searchColumns = propSearchColumns || columns.map(c => c.name);
            if (table.search) {
                rows = rows.filter(d => {
                    let result = false;
                    for (let i = 0; i < searchColumns.length; i++) {
                        if (d[searchColumns[i]]) {
                            let colValue = d[searchColumns[i]];
                            let colOpts = columns.find(col => col.name === searchColumns[i]).options;
                            if (colOpts && colOpts.transformData) {
                                colValue = colOpts.transformData(colValue, d).toString().toLowerCase();
                            } else {
                                colValue = colValue.toString().toLowerCase();
                            }

                            if (colValue.includes(table.search.toLowerCase())) {
                                result = true;
                                break;
                            }
                        }
                    }
                    return result;
                })
            }

            table.filters.forEach((f) => {
                if (f.value[0] === null) {
                    return;
                }

                let colOpts = columns.find(col => col.name === f.column).options || {};
                rows = rows.filter(d => {
                    if (colOpts.transformData) {
                        return colOpts.transformData(d[f.column], d) === f.value[0];
                    } else if (colOpts.type === "array") {
                        if (colOpts.filterType === "and") {
                            let includesAll = true;
                            f.value.forEach(v => {
                                if (!d[f.column].includes(v)) {
                                    includesAll = false;
                                }
                            });
                            return includesAll;
                        } else {
                            return d[f.column].find(_ => f.value.includes(_)) !== undefined;
                        }
                    } else {
                        return d[f.column] === f.value[0];
                    }
                });
            });

            rows = rows.sort(SortData(table.sort, columns))

            setTotal(rows.length);
            setIsLoading(false);
            setRows(disablePaging ? rows : rows.slice(table.rowsPerPage * table.page, table.rowsPerPage * (table.page + 1)));
        }
    }, [
        //showLoader,
        //stopLoader,
        //columns,
        data,
        filtersWithData,
        disablePaging,
        disableToken,
        propSearchColumns,
        table.filters,
        table.rowsPerPage,
        table.search,
        table.sort,
        table.page
    ]);

    useEffect(() => {
        if (!filtersWithData) {
            if (filterList && typeof (filterList) === "string") {
                async function fetchFiltersFromServer() {
                    const filtersData = await HttpUtil.fetchGetAsync(filterList, null, disableToken ? true : false);
                    setFilters(filtersData);
                }
                fetchFiltersFromServer();
            } else if (filterList && typeof (filterList) === "object") {
                setFilters(filterList);
            }
        }
    }, [filterList, filtersWithData, disableToken]);

    useEffect(() => {
        function EventCtlrClicked(e) { e.code === "ControlLeft" && setCtrlIsClicked(true) };
        function EventCtlrUnclicked(e) { e.code === "ControlLeft" && setCtrlIsClicked(false) };

        window.addEventListener("keydown", EventCtlrClicked);
        window.addEventListener("keyup", EventCtlrUnclicked);
        return () => {
            window.removeEventListener("keydown", EventCtlrClicked);
            window.removeEventListener("keyup", EventCtlrUnclicked);
        };
    }, []);

    useEffect(() => {
        var tableHeaderTop = document.querySelector('thead').getBoundingClientRect().top;
        var ths = document.querySelectorAll('thead th');
        for (var i = 0; i < ths.length; i++) {
            var th = ths[i];
            if (stickyHeader) {
                th.style.position = "sticky";
                th.style.top = th.parentNode.getBoundingClientRect().top - tableHeaderTop + "px";
                th.style.backgroundColor = "#fff";
            } else {
                th.style.position = undefined;
                th.style.top = undefined;
                th.style.backgroundColor = undefined;
            }
        }
    }, [stickyHeader]);

    useEffect(() => {
        dispatch({ type: SET_SELECT, selectedRows: propSelectedRows });
    }, [propSelectedRows]);

    const ResetSearch = useCallback(() => {
        setShowSearch(title === undefined);
        dispatch({ type: RESET_SEARCH });
        onSearchChanged && onSearchChanged("");
    }, [title, onSearchChanged]);

    function ChangeFilter(filter) {
        let { name, value = undefined, type = null, start = undefined, end = undefined, min = undefined, max = undefined, label = null, checked = undefined } = filter;
        let filters = [...table.filters];
        if (
            value === "all" ||
            value === "" ||
            checked === false ||
            (Array.isArray(value) && filters.find(f => f.column === name) && value.includes(""))
        ) {
            filters = filters.filter(f => f.column !== name);
        } else {
            if (filters.find(f => f.column === name && (type == null || type === f.type))) {
                filters = filters.map(f => {
                    if (f.column === name && (!f.value.includes(value) || value == null) && (type == null || f.type === type)) {
                        return {
                            column: name,
                            value: multiFilter && type == null ? [...f.value, value] : [value],
                            type,
                            start: start || f.start,
                            end: end || f.end,
                            min: min || f.min,
                            max: max || f.max,
                            label: label || f.label,
                            checked: checked != null ? checked : f.checked
                        }
                    } else if (f.column === name && f.value.includes(value) && type == null) {
                        return {
                            column: name,
                            value: f.value.filter(v => v !== value),
                            type,
                            start: start || f.start,
                            end: end || f.end,
                            min: min || f.min,
                            max: max || f.max,
                            label: label || f.label,
                            checked: checked != null ? checked : f.checked
                        }
                    }
                    return f;
                });
            } else {
                filters.push({
                    column: name,
                    value: [value],
                    type,
                    start,
                    end,
                    min,
                    max,
                    label,
                    checked
                });
            }
        }

        onFilterChanged && onFilterChanged(filters);
        dispatch({ type: SET_FILTERS, filters: filters });
    }

    function GetFilterValue(name) {
        if (multiFilter) {
            return "";
        }
        return table.filters.find(f => f.column === name) || [""];
    }

    function ChangeSort(sorted, name) {
        let sort = [...table.sort];
        var sortState = {
            column: name,
            dir: !sorted ? "asc" : sorted.dir === "asc" ? "desc" : "asc"
        };
        if (!ctrlIsClicked) {
            sort = [sortState];
        } else if (!sorted) {
            sort.push(sortState);
        } else {
            sort = sort.map(s => s.column === name ? sortState : s);
        }

        dispatch({ type: SET_SORT, sort });
        onSortingChanged && onSortingChanged(sort);
    }

    function DeleteFilter(f, fv) {
        let filters = [...table.filters];
        if (f.type != null && f.type === 'date') {
            if (f.start && f.end) {
                filters = filters.map(fd => {
                    if (fd.column !== f.column) {
                        return fd;
                    } else {
                        return {
                            ...fd,
                            start: fv === 'start' ? null : fd.start,
                            end: fv === 'end' ? null : fd.end
                        }
                    }
                });
            } else {
                filters = filters.filter(fd => fd.column !== f.column);
            }
        } else if (f.type != null && f.type === 'number') {
            if (f.min && f.max) {
                filters = filters.map(fd => {
                    if (fd.column !== f.column) {
                        return fd;
                    } else {
                        return {
                            ...fd,
                            min: fv === 'min' ? null : fd.min,
                            max: fv === 'max' ? null : fd.max
                        }
                    }
                });
            } else {
                filters = filters.filter(fd => fd.column !== f.column);
            }
        }
        else {
            if (filters.find(fd => fd.column === f.column).value.length === 1) {
                filters = filters.filter(fd => fd.column !== f.column);
            } else {
                filters = filters.map(fd => {
                    if (fd.column !== f.column) {
                        return fd;
                    } else {
                        return {
                            ...fd,
                            value: fd.value.filter(
                                fdv => fdv !== fv)
                        }
                    }
                });
            }
        }
        dispatch({ type: SET_FILTERS, filters });
        onFilterChanged && onFilterChanged(filters);
    }

    function ToggleTotal(id) {
        let newOpenTotals = [...openTotals];
        if (newOpenTotals.includes(id)) {
            newOpenTotals = RemoveTotals(newOpenTotals, id);
        } else {
            newOpenTotals.push(id);
        }
        setOpenTotals(newOpenTotals);
    }

    function RemoveTotals(openTotals, id) {
        openTotals = openTotals.filter(t => t !== id);
        openTotals.forEach(() => {
            let childRows = rows.filter(r => r.totalId === id);
            childRows.forEach(r => {
                if (r.totalRow)
                    openTotals = RemoveTotals(openTotals, r.id);
            })
        });
        return openTotals;
    }

    function RenderFilter(f) {
        return {
            'bool': <Chip
                key={"col-" + f.column + "-chip"}
                style={{ marginLeft: 8, marginBottom: 8 }}
                label={f.checked ? 'Да' : 'Нет'}
                onDelete={() => { DeleteFilter(f, 'checked'); }}
            />,
            'number': <>
                {f.min && <Chip
                    key={"col-" + f.column + "-chip-min"}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={"Больше " + f.min}
                    onDelete={() => { DeleteFilter(f, 'min'); }}
                />}
                {f.max && <Chip
                    key={"col-" + f.column + "-chip-max"}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={"Меньше " + f.max}
                    onDelete={() => { DeleteFilter(f, 'max'); }}
                />}</>,
            'date': <>
                {f.start && <Chip
                    key={"col-" + f.column + "-chip-start"}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={"Позже " + moment(f.start).format('L')}
                    onDelete={() => { DeleteFilter(f, 'start'); }}
                />}
                {f.end && <Chip
                    key={"col-" + f.column + "-chip-end"}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={"Раньше " + moment(f.end).format('L')}
                    onDelete={() => { DeleteFilter(f, 'end'); }}
                />}</>,
            null: f.value.map((fv, fvInd) =>
                <Chip
                    key={"col-" + f.column + "-chip-" + fvInd}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={fv}
                    onDelete={() => { DeleteFilter(f, fv); }}
                />),
            undefined: f.value.map((fv, fvInd) =>
                <Chip
                    key={"col-" + f.column + "-chip-" + fvInd}
                    style={{ marginLeft: 8, marginBottom: 8 }}
                    label={fv}
                    onDelete={() => { DeleteFilter(f, fv); }}
                />)
        }[f.type]
    }

    let rowNumber = table.rowsPerPage * table.page + 1;

    return <>
        <Paper>
            {
                (
                    title ||
                    !disableSearch ||
                    onDownload ||
                    table.sections ||
                    filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).length > 0
                ) &&
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    {
                        !showSearch ?
                            <Typography variant="h6">
                                {title}
                            </Typography> :
                            <div style={{ display: "flex" }}>
                                <Icon classes={{ root: classes.icon }}>
                                    <Search />
                                </Icon>
                                <TextField
                                    ref={searchElement}
                                    value={table.search}
                                    onKeyUp={e => e.key === "Escape" && ResetSearch()}
                                    onChange={e => {
                                        var searchVal = e.currentTarget.value;
                                        dispatch({ type: SEARCH, search: searchVal });
                                        onSearchChanged && onSearchChanged(searchVal);
                                    }}
                                />
                                {
                                    title &&
                                    <IconButton onClick={() => ResetSearch()}>
                                        <Clear />
                                    </IconButton>
                                }
                            </div>
                    }
                    {
                        (!title && disableSearch && table.filters.length > 0) &&
                        <Box display="flex" pl="24px" flexWrap="wrap">
                            {
                                table.filters.map(f =>
                                    <Box key={"col-" + f.column} display="flex" alignItems="center" mr={1} flexWrap="wrap">
                                        <Typography variant="body2" color="textSecondary">
                                            {columns.find(tc => tc.name === f.column) ? columns.find(tc => tc.name === f.column).label : f.label}:
                                        </Typography>
                                        {RenderFilter(f)}
                                    </Box>
                                )
                            }
                        </Box>
                    }
                    <Box display="flex">
                        {customToolbar}
                        {
                            (disableSearch && title) &&
                            <IconButton onClick={() => { setShowSearch(true); searchElement.focus() }}>
                                <Search color={showSearch ? "primary" : undefined} />
                            </IconButton>
                        }
                        {
                            (onDownload && typeof onDownload !== "function") &&
                            <IconButton
                                onClick={async () => {
                                    showLoader && showLoader();
                                    let data;
                                    if (downloadWithFilters) {
                                        let options = {
                                            rowsPerPage: table.rowsPerPage,
                                            page: table.page,
                                            search: table.search,
                                            sort: table.sort,
                                            filters: table.filters
                                        };
                                        data = await HttpUtil.fetchAsync(onDownload, options, "POST", disableToken ? true : false);
                                    } else {
                                        data = await HttpUtil.fetchGetAsync(onDownload, null, disableToken ? true : false);
                                    };

                                    if (data.error) {
                                        alert(data.error);
                                    } else {
                                        var reqFile = data.file;
                                        var file = CreateFile(reqFile, mimeType || 'text/csv;charset=utf-8');
                                        var element = document.createElement('a');
                                        var fName = data.name ||
                                            downloadName + new Date().toLocaleString("ru-RU").replace(", ", "").replace(/\./g, "").replace(/:/g, "") + ".csv";
                                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                            window.navigator.msSaveOrOpenBlob(file, fName);
                                        } else {
                                            element.setAttribute('href', file.preview);
                                            element.setAttribute('download', fName);
                                            element.style.display = 'none';
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                        }
                                    }
                                    stopLoader && stopLoader();
                                }}
                            >
                                <GetApp />
                            </IconButton>
                        }
                        {
                            (onDownload && typeof onDownload === "function") &&
                            <IconButton
                                onClick={() => {
                                    let options = {
                                        rowsPerPage: table.rowsPerPage,
                                        page: table.page,
                                        search: table.search,
                                        sort: table.sort,
                                        filters: table.filters
                                    };
                                    onDownload(options);
                                }}
                            >
                                <GetApp />
                            </IconButton>
                        }
                        {
                            table.sections &&
                            <IconButton
                                buttonRef={sectionsButtonElement}
                                onClick={() => setSectionsOpen(true)}
                            >
                                <ViewColumn />
                            </IconButton>
                        }
                        {
                            filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).length > 0 &&
                            <IconButton
                                buttonRef={menuButtonElement}
                                onClick={() => setFilterOpen(true)}
                            >
                                <FilterList />
                            </IconButton>
                        }
                        <Popover
                            anchorEl={sectionsButtonElement.current}
                            open={sectionsOpen}
                            anchorOrigin={{ vertical: 50, horizontal: -200 }}
                            onClose={() => setSectionsOpen(false)}
                            classes={{
                                paper: classes.paperMenu
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="body2">СЕКЦИИ</Typography>
                            </div>
                            {
                                table.sections && columns.filter(c => c.options && c.options.sectionFilterLabel).map((c, i) =>
                                    <Box display="flex" alignItems="center" mt="10px" key={"sect" + i}>
                                        <Checkbox
                                            color="secondary"
                                            checked={table.sections[c.options.section].expanded}
                                            onChange={() => dispatch({
                                                type: SET_SECTIONS,
                                                sections: {
                                                    ...table.sections,
                                                    [c.options.section]: {
                                                        ...table.sections[c.options.section],
                                                        expanded: !table.sections[c.options.section].expanded
                                                    }
                                                }
                                            })
                                            }
                                        />
                                        <Box width="275px" ml="16px">
                                            <Typography variant="body2">{c.options.sectionFilterLabel}</Typography>
                                        </Box>
                                    </Box>
                                )
                            }
                        </Popover>
                        <Popover
                            anchorEl={menuButtonElement.current}
                            open={filterOpen}
                            anchorOrigin={{ vertical: 50, horizontal: -200 }}
                            onClose={() => setFilterOpen(false)}
                            classes={{
                                paper: classes.paperMenu
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">ФИЛЬТРЫ</Typography>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    style={{ fontSize: 12, padding: "6px 8px" }}
                                    onClick={() => {
                                        dispatch({ type: RESET_FILTERS });
                                        onFilterChanged && onFilterChanged([]);
                                    }}
                                >
                                    СБРОСИТЬ
                                </Button>
                            </Box>
                            <Box display="flex" flexWrap="wrap" ml="-16px">
                                {
                                    filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).map((filter, i) =>
                                        <Filter
                                            classes={classes}
                                            key={"tab-filt-" + i}
                                            c={columns.find(c => c.name === filter.column)}
                                            changeFilter={ChangeFilter}
                                            getFilterValue={GetFilterValue}
                                            currentFilter={table.filters.find(currentFilter => currentFilter.column === filter.column)}
                                            filter={filter}
                                            multiFilter={multiFilter}
                                        />
                                    )
                                }
                            </Box>
                        </Popover>
                    </Box>
                </Toolbar>
            }
            {
                filters.filter(f => f.inToolbar === true).length > 0 &&
                <div style={{ display: "flex", flexWrap: "wrap" }} >
                    {
                        filters.filter(f => f.inToolbar === true).map((filter, i) =>
                            <Filter
                                classes={classes}
                                key={"tab-filt-" + i}
                                c={columns.find(c => c.name === filter.column)}
                                changeFilter={ChangeFilter}
                                getFilterValue={GetFilterValue}
                                currentFilter={table.filters.find(currentFilter => currentFilter.column === filter.column)}
                                filter={filter}
                                multiFilter={multiFilter}
                            />
                        )
                    }
                </div>
            }
            {
                (
                    (title || !disableSearch) &&
                    table.filters.length > 0
                )
                &&
                <div style={{ display: "flex", paddingLeft: 24, flexWrap: 'wrap' }}>
                    {
                        table.filters.map(f =>
                            <Box key={"col-" + f.column} display="flex" alignItems="center" mr={1} flexWrap="wrap">
                                <Typography variant="body2" color="textSecondary">
                                    {columns.find(tc => tc.name === f.column) ? columns.find(tc => tc.name === f.column).label : f.label}:
                                </Typography>
                                {RenderFilter(f)}
                            </Box>
                        )
                    }
                </div>
            }
            <Box style={{ maxHeight: `calc(100vh - ${maxHeight}px)` }} overflow="auto">
                <Table
                    className={classes.table}
                    size={small ? "small" : 'medium'}
                    style={{
                        minWidth: minWidth,
                        overflowX: overflow ? "auto" : undefined,
                        borderCollapse: stickyHeader ? "separate" : null,
                        borderSpacing: stickyHeader ? 0 : null
                    }}
                >
                    <TableHead>
                        {
                            headRows.length > 0 ?
                                headRows.map((r, index) => {
                                    return <TableRow key={"table-row-" + index}>
                                        {
                                            (index === 0 && onRowSelect) &&
                                            <TableCell style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                <Checkbox
                                                    checked={table.selectedRows.length > 0 && table.selectedRows.length === rows.length}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            dispatch({ type: SET_SELECTED_ROWS, selectedRows: rows });
                                                            onRowSelect && onRowSelect(rows);
                                                        } else {
                                                            dispatch({ type: RESET_SELECTED_ROWS });
                                                            onRowSelect && onRowSelect([]);
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        }
                                        {index === 0 && showRowNums &&
                                            <TableCell key="hd0" rowSpan={headRows.length} style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                        }
                                        {
                                            r.map((c, i) => {
                                                return <HeadCell
                                                    sections={table.sections}
                                                    key={"hd1" + i}
                                                    column={c}
                                                    classes={classes}
                                                    sorted={table.sort.find(s => s.column === c.name)}
                                                    sort={ChangeSort}
                                                    small={small}
                                                    sortIndex={table.sort.length < 2 ? undefined : table.sort.map(s => s.column).indexOf(c.name)}
                                                />
                                            })
                                        }
                                    </TableRow>;
                                })
                                : <TableRow>
                                    {
                                        onRowSelect &&
                                        <TableCell style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                            <Checkbox
                                                checked={table.selectedRows.length > 0 && table.selectedRows.length === rows.length}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        dispatch({ type: SET_SELECTED_ROWS, selectedRows: rows });
                                                        onRowSelect(rows);
                                                    } else {
                                                        dispatch({ type: RESET_SELECTED_ROWS });
                                                        onRowSelect([]);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    }
                                    {
                                        showRowNums &&
                                        <TableCell key="hd0" style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                    }
                                    {
                                        displayColumns.map((c, i) => {
                                            return <HeadCell
                                                sections={table.sections}
                                                key={"hd2" + i}
                                                column={c}
                                                classes={classes}
                                                sorted={table.sort.find(s => s.column === c.name)}
                                                sort={ChangeSort}
                                                small={small}
                                                sortIndex={table.sort.length < 2 ? undefined : table.sort.map(s => s.column).indexOf(c.name)}
                                            />;
                                        })
                                    }
                                </TableRow>
                        }
                        {
                            showColNums &&
                            <TableRow>
                                {
                                    showRowNums &&
                                    <TableCell key="hd0" style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>1</TableCell>
                                }
                                {
                                    columns.filter(c => !c.options || !c.options.onlyHead).map((c, i) => {
                                        return <TableCell key={c.name} style={{
                                            ...(c.options && c.options.customHeadStyle),
                                            padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                            display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                                            zIndex: 1
                                        }}>
                                            {i + (showRowNums ? 2 : 1)}
                                        </TableCell>;
                                    }
                                    )
                                }
                            </TableRow>
                        }
                    </TableHead>
                    <TableBody>
                        {
                            isLoading ?
                                <TableRow>
                                    <TableCell
                                        colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0)}
                                        style={{ textAlign: "center", height: 36 }}
                                    >
                                        Загрузка...
                                </TableCell>
                                </TableRow> :
                                rows.length === 0 ?
                                    <TableRow>
                                        <TableCell
                                            colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0)}
                                            style={{ textAlign: "center", height: 36 }}
                                        >
                                            {noDataMessage || 'Нет данных для отображения'}
                                        </TableCell>
                                    </TableRow> :
                                    rows.map((n, rowI) =>
                                        <TableRow
                                            hover={onRowClick != null}
                                            style={{
                                                cursor: onRowClick ? "pointer" : "default",
                                                backgroundColor: color ? color(n) : "normal",
                                                display: !n.totalId || openTotals.includes(n.totalId) ? "table-row" : "none"
                                            }}
                                            className={stripedRows && rowI % 2 ? classes.stripedRow : null}
                                            key={"row" + n.id}
                                            onClick={() => !n.totalRow && onRowClick && onRowClick(n)}
                                            onContextMenu={e => {
                                                if (context) {
                                                    e.preventDefault();
                                                    let visibleContext = context.filter(c => c.hidden === undefined || c.hidden === null || c.hidden(n) === false);
                                                    if (visibleContext.length > 0) {
                                                        setContextOptions(
                                                            contextOptions === null ?
                                                                { position: { x: e.clientX - 2, y: e.clientY - 4 }, context: visibleContext, id: n[idField], row: n } :
                                                                {}
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            {
                                                onRowSelect &&
                                                <TableCell key={"checkbox" + n.id} style={{ padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                    <Checkbox
                                                        checked={!!table.selectedRows.find(sc => sc[idField] === n[idField])}
                                                        onChange={async (event) => {
                                                            let selectedRows;
                                                            if (event.target.checked) {
                                                                selectedRows = [...table.selectedRows, n];
                                                            } else {
                                                                selectedRows = [...table.selectedRows].filter(sc => sc[idField] !== n[idField]);
                                                            }
                                                            dispatch({ type: SET_SELECTED_ROWS, selectedRows });
                                                            onRowSelect(selectedRows);
                                                        }}
                                                    />
                                                </TableCell>
                                            }
                                            {
                                                (showRowNums && !n.totalRow) &&
                                                <TableCell key={"row-" + n.id + "-number"} style={{ padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>{rowNumber++}</TableCell>
                                            }
                                            {
                                                n.totalRow && !totalRow &&
                                                <TableCell>
                                                    <IconButton aria-label="expand row" size="small" onClick={() => ToggleTotal(n.id)}>
                                                        {openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                            }
                                            {
                                                displayColumns.filter(c => !c.options || !c.options.onlyHead).map((c, i) =>
                                                    n.totalRow && c.name === totalRow ?
                                                        <TableCell>
                                                            <IconButton aria-label="expand row" size="small" onClick={() => ToggleTotal(n.id)}>
                                                                {openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell> :
                                                        <TableCell key={"row-" + n.id + "-column-" + c.name}
                                                            style={{
                                                                display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                                                                padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                                paddingRight: i === columns.length - 1 ? 16 : 4,
                                                                backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                                                                fontWeight: n.totalRow ? "bold" : "inherit"
                                                            }}
                                                        >
                                                            {c.options && c.options.customBodyRender ? c.options.customBodyRender(n[c.name], n) : dateFormat.test(n[c.name]) ? moment(n[c.name]).format('L') : n[c.name]}
                                                        </TableCell>
                                                )
                                            }
                                        </TableRow>
                                    )}
                    </TableBody>
                </Table>
            </Box>
            {
                !disablePaging &&
                <TablePagination
                    component="div"
                    count={total}
                    rowsPerPageOptions={rowsPerPageOptions || [10, 25, 50, 100]}
                    rowsPerPage={table.rowsPerPage}
                    labelRowsPerPage="Строк на странице"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                    page={table.page}
                    backIconButtonProps={{
                        'aria-label': 'Пред. страница',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'След. страница',
                    }}
                    onChangePage={(event, page) => {
                        dispatch({ type: SET_PAGE, page });
                    }}
                    onChangeRowsPerPage={event => {
                        dispatch({ type: SET_ROWS_PER_PAGE, rowsPerPage: event.target.value });

                    }}
                />
            }
        </Paper>
        <Menu
            anchorReference="anchorPosition"
            anchorPosition={
                contextOptions !== null
                    ? { top: contextOptions.position.y, left: contextOptions.position.x }
                    : undefined
            }
            open={contextOptions !== null}
            onClose={() => setContextOptions(null)}
        >
            {
                contextOptions && contextOptions.context.map((o, i) => <MenuItem
                    key={"cm-" + i}
                    onClick={() => {
                        if (o.prevContext) {
                            setContextOptions({ ...contextOptions, context: o.prevContext });
                        } else if (o.options) {
                            setContextOptions({ ...contextOptions, context: [...o.options, { name: "<", prevContext: contextOptions.context }] });
                        } else {
                            setContextOptions(null);
                            o.action(contextOptions.id, contextOptions.row);
                        }
                    }
                    }
                >
                    {o.name}
                </MenuItem>)
            }
        </Menu>
    </>;
})

const useStyles = makeStyles({
    inputRoot: {
        marginTop: "24px !important"
    },
    stripedRow: {
        backgroundColor: '#fafafa'
    },
    overflow: {
        overflowX: 'auto'
    },
    paperMenu: {
        padding: 16,
        maxWidth: 800,
        minWidth: 200
    },
    icon: {
        marginTop: 10,
        color: "rgba(0, 0, 0, 0.54)",
        marginRight: 8
    }
})

export default NerisTable;

class ColumnOptionsClass {
    display;
    type;
    filterType;
    sort;
    trasformData;
    customHeadRender;
    customBodyRender;
}

ColumnOptionsClass.propTypes = {
    display: PropTypes.bool,
    type: PropTypes.oneOf(['array']),
    filterType: PropTypes.oneOf(['and', 'or']),
    sort: PropTypes.bool,
    trasformData: PropTypes.func,
    customHeadRender: PropTypes.func,
    customBodyRender: PropTypes.func,
}

class SortClass {
    column;
    dir;
}

SortClass.propTypes = {
    columnn: PropTypes.string,
    dir: PropTypes.string
}

class FilterClass {
    column;
    value;
    inToolbar;
}

FilterClass.propTypes = {
    columnn: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string),
    inToolbar: PropTypes.bool,
}

class ColumnClass {
    name;
    label;
    options;
}

ColumnClass.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.instanceOf(ColumnOptionsClass)
}

class ContextClass {
    name;
    action;
    options;
}

ContextClass.propTypes = {
    name: PropTypes.string,
    action: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.instanceOf(ContextClass))
}

NerisTable.propTypes = {
    showLoader: PropTypes.func,
    stopLoader: PropTypes.func,
    onSearchChanged: PropTypes.func,
    onFilterChanged: PropTypes.func,
    onDownload: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onSortingChanged: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    downloadName: PropTypes.string,
    filterList: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    search: PropTypes.string,
    title: PropTypes.string,
    mimeType: PropTypes.string,
    showColNums: PropTypes.bool,
    stickyHeader: PropTypes.bool,
    disablePaging: PropTypes.bool,
    showRowNums: PropTypes.bool,
    multiFilter: PropTypes.bool,
    disableSearch: PropTypes.bool,
    downloadWithFilters: PropTypes.bool,
    disableToken: PropTypes.bool,
    overflow: PropTypes.bool,
    sort: PropTypes.arrayOf(PropTypes.object),
    rowCount: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),
    context: PropTypes.arrayOf(PropTypes.object),
    stripedRows: PropTypes.bool
};