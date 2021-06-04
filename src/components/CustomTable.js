import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
    Badge
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
    return <TableCell
        align="left"
        key={column.name} style={{
            ...(column.options && column.options.customHeadStyle),
            padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
            display: (column.options && column.options.section && !sections[column.options.section].expanded) ? "none" : null,
            zIndex: 1
        }}
        rowSpan={column.options && column.options.rowSpan} colSpan={column.options && column.options.colSpan}>
        {
            !column.options || (column.options.sort !== false && !column.options.onlyHead) ?
                <Badge
                    badgeContent={isNaN(sortIndex + 1) ? "" : (sortIndex + 1)}
                    invisible={sortIndex === undefined || sortIndex === -1}
                >
                    <TableSortLabel
                        active={!!sorted}
                        direction={sortDir}
                        onClick={() => sort(sorted, column.name)}
                    >
                        {
                            column.options && column.options.customHeadRender ?
                                column.options.customHeadRender(classes) :
                                column.label
                        }
                    </TableSortLabel>
                </Badge> :
                column.options && column.options.customHeadRender ?
                    column.options.customHeadRender(classes) :
                    column.label
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
        switch (filter.type) {
            case "bool":
                return <Box
                    key={"filter-key-" + filter.column}
                    style={{ width: filter.inToolbar ? '350px' : 'calc(50% - 16px)', marginBottom: 16, marginLeft: filter.inToolbar ? 24 : 16 }}
                    id={"filter-" + filter.column}
                    display="flex"
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                key={"filter-key-" + filter.column}
                                id={"filter-" + filter.column}
                                checked={currentFilter ? currentFilter.checked : false}
                                onChange={(e) => { props.changeFilter({ name: filter.column, type: "bool", checked: e.target.checked, label: filter.label }); }}
                                color="secondary"
                            />
                        }
                        label={c ? c.label : filter.label} /></Box>;
            case "number":
                if (currentFilter != null) {
                    min = currentFilter.min;
                    max = currentFilter.max;
                }
                return <Box
                    key={"filter-key-" + filter.column}
                    style={{ width: filter.inToolbar ? '350px' : 'calc(50% - 16px)', marginBottom: 16, marginLeft: filter.inToolbar ? 24 : 16 }}
                    id={"filter-" + filter.column}
                >
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
                </Box>;
            case "date":
                if (currentFilter != null) {
                    start = currentFilter.start;
                    end = currentFilter.end;
                }
                return <Box
                    key={"filter-key-" + filter.column}
                    style={{ width: filter.inToolbar ? '350px' : 'calc(50% - 16px)', marginBottom: 16, marginLeft: filter.inToolbar ? 24 : 16 }}
                    id={"filter-" + filter.column}
                >
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
                </Box>;
            default:
                return <Box
                    key={"filter-key-" + filter.column}
                    style={{ width: filter.inToolbar ? '350px' : 'calc(50% - 16px)', marginBottom: 16, marginLeft: filter.inToolbar ? 24 : 16 }}
                    id={"filter-" + filter.column}
                >
                    <Autocomplete
                        classes={{
                            inputRoot: classes.inputRoot
                        }}
                        style={{ minWidth: 200 }}
                        disableClearable
                        disableCloseOnSelect
                        options={["Все"].concat(filter.value)}
                        autoHighlight
                        value={[]}
                        getOptionLabel={(option) => option ? option.toString() : ""}
                        renderOption={(option) => (
                            <React.Fragment>
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
                            </React.Fragment>
                        )}
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
                    />
                </Box>;
        }
    } else
        return null;
}

class CustomTable extends Component {
    _menuButton = null;
    _sections = null;
    _search = null;
    _ctrlClicked = false;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rows: null,
            filteredData: null,
            searching: this.props.title ? !!this.props.search : true,
            filterOpen: false,
            sectionsOpen: false,
            filters: null,
            total: 0,
            table: {
                rowsPerPage: this.props.rowCount || rowCount,
                page: 0,
                search: "",
                sort: props.sort ? props.sort : props.sortBy ? [{ column: props.sortBy, dir: props.sortDir || "asc" }] : [],
                sortDir: props.sortDir,
                filters: props.initialFilters || [],
                columns: props.columns,
                sections: this.props.sections,
                selectedRows: [],
                globalCheck: false
            },
            openTotals: []
        };

        this._setCtrlClicked = this._setCtrlClicked.bind(this);
        this._unsetCtrlClicked = this._unsetCtrlClicked.bind(this);
    }

    async componentDidMount() {
        await this._fetch();

        if (!this.props.filtersWithData) {
            if (this.props.filterList && typeof (this.props.filterList) === "string") {
                const filtersData = await HttpUtil.fetchGetAsync(this.props.filterList);
                this.setState({
                    filters: filtersData.filters
                });
            } else if (this.props.filterList && typeof (this.props.filterList) === "object") {
                this.setState({
                    filters: this.props.filterList
                });
            }
        }
        if (this.props.select) {
            this.setState({
                table: {
                    ...this.state.table,
                    selectedRows: this.props.onLoadSelect || []
                }
            })
        }

        window.addEventListener("keydown", this._setCtrlClicked);
        window.addEventListener("keyup", this._unsetCtrlClicked);


    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this._setCtrlClicked);
        window.removeEventListener("keyup", this._unsetCtrlClicked);
    }

    _setCtrlClicked(e) {
        if (e.code === "ControlLeft") {
            this._ctrlClicked = true;
        }
    }

    _unsetCtrlClicked(e) {
        if (e.code === "ControlLeft") {
            this._ctrlClicked = false;
        }
    }

    _changeFilter = (filter) => {
        let { name, value = undefined, type = null, start = undefined, end = undefined, min = undefined, max = undefined, label = null, checked = undefined } = filter;
        let filters = this.props.onFilterChanged ? [...(this.props.initialFilters ? this.props.initialFilters : this.state.table.filters)] : [...this.state.table.filters];
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
                            value: this.props.multiFilter && type == null ? [...f.value, value] : [value],
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
        if (this.props.onFilterChanged) {
            this.props.onFilterChanged(filters)
            this.setState({
                table: {
                    ...this.state.table,
                    filters: this.props.initialFilters ? this.props.initialFilters : filters,
                    page: 0
                }
            }, () => this._fetch());
        } else {
            this.setState({
                table: {
                    ...this.state.table,
                    filters,
                    page: 0
                }
            }, () => this._fetch());
        }
    }

    _getFilterValue = (name) => {
        return this.props.multiFilter
            ? ""
            : !this.props.onFilterChanged
                ? (this.state.table.filters.find(f => f.column === name)
                    ? (this.state.table.filters.find(f => f.column === name).value[0] || "")
                    : "")
                : this.props.initialFilters ?
                    (this.props.initialFilters.find(f => f.column === name)
                        ? (this.props.initialFilters.find(f => f.column === name).value || [""])
                        : [""]) :
                    (this.state.table.filters.find(f => f.column === name)
                        ? (this.state.table.filters.find(f => f.column === name).value[0] || "")
                        : "");
    }

    _sort() {
        var sort = this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : this.state.table.sort;
        var fields = [].slice.call(sort.map(s => ({
            name: s.column,
            reverse: s.dir === "desc",
            transformData: ((this.props.columns.find(c => c.name === s.column) || {}).options || {}).transformData
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

    async _fetch() {
        if (typeof (this.props.data) === "string") {
            let tableState = { ...this.state.table };
            let options = {
                rowsPerPage: tableState.rowsPerPage,
                page: tableState.page,
                search: this.props.search || tableState.search,
                sort: this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : tableState.sort,
                filters: this.props.onFilterChanged ? (this.props.initialFilters ? this.props.initialFilters : tableState.filters) : tableState.filters
            };

            this.props.showLoader && this.props.showLoader();
            let filtersData = this.state.filters;
            var rowData = await HttpUtil.fetchAsync(this.props.data, options, "POST");
            if (this.props.filtersWithData)
                filtersData = rowData.filters;
            this.setState({
                rows: rowData.rows,
                total: rowData.total,
                isLoading: false,
                filters: filtersData
            });
            this.props.stopLoader && this.props.stopLoader();
        } else {
            this.setState({
                isLoading: false,
                filteredData: [...this.props.data],
            });
        }

        if (this.props.stickyHeader) {
            var tableHeaderTop = document.querySelector('thead').getBoundingClientRect().top;
            var ths = document.querySelectorAll('thead th');
            for (var i = 0; i < ths.length; i++) {
                var th = ths[i];
                th.style.position = "sticky";
                th.style.top = th.parentNode.getBoundingClientRect().top - tableHeaderTop + "px";
                th.style.backgroundColor = "#fff";
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        //Изменение фильтров
        var filtersChanged = false;
        var prevFilters = prevProps.initialFilters || [];
        var curFilters = this.props.initialFilters || [];
        if (prevFilters.length !== curFilters.length) {
            filtersChanged = true;
        } else {
            prevFilters.forEach(pf => {
                var newF = curFilters.find(cf => cf.column === pf.column);
                if (newF) {
                    var checkNewContainsOld = newF.value.every(nv => pf.value.includes(nv));
                    var checkOldContainsNew = pf.value.every(ov => newF.value.includes(ov));
                    if (!checkNewContainsOld || !checkOldContainsNew) {
                        filtersChanged = true;
                    }
                } else {
                    filtersChanged = true;
                }
            });
        }
        //Изменение сортировки
        let sortingChanged = false;
        let prevSorting = prevProps.sort || [];
        var curSorting = this.props.sort || [];
        if (prevSorting.length !== curSorting.length) {
            sortingChanged = true;
        } else {
            prevSorting.forEach(ps => {
                var newS = curSorting.find(cs => cs.column === ps.column);
                if (newS) {
                    if (newS.dir !== ps.dir) {
                        sortingChanged = true;
                        return;
                    }
                } else {
                    sortingChanged = true;
                    return;
                }
            });
        }
        //Изменение data
        let dataChanged = false;
        if (typeof (this.props.data) === "string" && this.props.data !== prevProps.data) {
            dataChanged = true;
        } else if (typeof (this.props.data) === "object" && 
            (this.props.data.length !== prevProps.data.length || !this.props.data.every((e, i) => e[this.props.idField || "id"] === prevProps.data[i][this.props.idField || "id"]))) {
            dataChanged = true;
        }

        if (filtersChanged || prevProps.search !== this.props.search || this.props.data.length !== prevProps.data.length || sortingChanged || dataChanged) {
            await this._fetch();
        }
    }

    _sortAsync = (sorted, name) => {
        let sort = this.props.onSortingChanged && this.props.disableSortProps !== true ? [...this.props.sort] : [...this.state.table.sort];
        var sortState = {
            column: name,
            dir: !sorted ? "asc" : sorted.dir === "asc" ? "desc" : "asc"
        };
        if (!this._ctrlClicked) {
            sort = [sortState];
        } else if (!sorted) {
            sort.push(sortState);
        } else {
            sort = sort.map(s => s.column === name ? sortState : s);
        }

        if (this.props.onSortingChanged && this.props.disableSortProps !== true) {
            this.props.onSortingChanged(sort);
        } else {
            this.setState({
                table: {
                    ...this.state.table,
                    sort
                }
            }, () => this._fetch());
            if (this.props.onSortingChanged && this.props.disableSortProps === true) {
                this.props.onSortingChanged(sort);
            }
        }
    }

    _deleteFilter = (f, fv) => {
        let filters = this.props.onFilterChanged
            ? [...(this.props.initialFilters ? this.props.initialFilters : this.state.table.filters)]
            : [...this.state.table.filters];
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
        if (this.props.onFilterChanged) {
            this.props.onFilterChanged(filters)
            this.setState({
                table: {
                    ...this.state.table,
                    filters: this.props.initialFilters ? this.props.initialFilters : filters,
                    page: 0
                }
            }, () => this._fetch());
        } else {
            this.setState({
                table: {
                    ...this.state.table,
                    filters,
                    page: 0
                }
            },
                () => this._fetch());
        }
    }

    _toggleTotal = (id) => {
        let openTotals = [...this.state.openTotals];
        if (this.state.openTotals.includes(id))
            openTotals = this.removeTotals(openTotals, id);
        else
            openTotals.push(id);
        this.setState({ openTotals })
    }

    removeTotals(openTotals, id) {
        openTotals = openTotals.filter(t => t !== id);
        openTotals.forEach(t => {
            let childRows = this.state.rows.filter(r => r.totalId === id);
            childRows.forEach(r => {
                if (r.totalRow)
                    openTotals = this.removeTotals(openTotals, r.id);
            })
        });
        return openTotals;
    }

    redrawColumns() {
        this.setState({
            table: {
                ...this.state.table,
                columns: this.props.columns
            }
        });
    }

    render() {
        let { classes } = this.props;
        let columns = this.state.table.columns.filter(c => !c.options || (c.options.display !== "excluded" && c.options.display !== false));
        let customFilters = columns.filter(c => c.options && c.options.filters !== undefined).map(c => ({ column: c.name, value: c.options.filters }));
        let filters = [...(this.state.filters || []), ...customFilters];
        var currentFilters = [...(this.props.onFilterChanged ? (this.props.initialFilters ? this.props.initialFilters : this.state.table.filters) : this.state.table.filters)];
        let rowNumber = this.state.table.rowsPerPage * this.state.table.page + 1;
        let idField = this.props.idField || "id";
        let headRows = [];
        if (this.props.headRows > 1) {
            for (let i = 1; i <= this.props.headRows; i++) {
                headRows.push(columns.filter(c => { return c.options && c.options.headRow === i }));
            }
        }

        let rows = [];
        let total = 0;
        if (typeof (this.props.data) === "object") {
            let tableState = { ...this.state.table };
            let data = [...this.props.data];
            let searchedColumns = tableState.searchedColumn || this.props.columns.map(c => c.name);
            let rowsPerPage = tableState.rowsPerPage;
            let page = tableState.page;
            let search = this.props.search || tableState.search;
            let filters = this.props.onFilterChanged ? (this.props.initialFilters ? this.props.initialFilters : tableState.filters) : tableState.filters;

            if (search !== null && search !== "") {
                data = data.filter(d => {
                    let result = false;
                    for (let i = 0; i < searchedColumns.length; i++) {
                        if (d[searchedColumns[i]]) {
                            let colValue = d[searchedColumns[i]];
                            let colOpts = this.props.columns.find(col => col.name === searchedColumns[i]).options;
                            if (colOpts && colOpts.transformData) {
                                colValue = colOpts.transformData(colValue, d).toString().toLowerCase();
                            } else {
                                colValue = colValue.toString().toLowerCase();
                            }
                            
                            if (colValue.includes(search.toLowerCase())) {
                                result = true;
                                break;
                            }
                        }
                    }
                    return result;
                })
            }

            filters.forEach((f) => {
                if (f.value[0] === null) {
                    return;
                }

                let colOpts = this.props.columns.find(col => col.name === f.column).options;

                data = data.filter(d => {
                    if (colOpts && colOpts.transformData) {
                        return colOpts.transformData(d[f.column], d) === f.value[0];
                    } else if (colOpts && colOpts.type === "array") {
                        return d[f.column].find(_ => f.value.includes(_)) !== undefined;
                    } else {
                        return d[f.column] === f.value[0];
                    }                    
                });
            });

            data = data.sort(this._sort());
            total = data.length;
            rows = this.props.disablePaging === true ? data : data.slice(rowsPerPage * page, rowsPerPage * (page + 1));
        } else if (typeof (this.props.data) === "object") {
            rows = this.state.rows;
            total = this.state.total;
        }

        return <div>
            <Paper>
                {
                    (
                        this.props.title ||
                        !this.props.disableSearch ||
                        this.props.onDownloadUrl ||
                        this.props.onDownload ||
                        this.state.table.sections ||
                        filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).length > 0
                    ) &&
                    <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                        {
                            !this.state.searching ?
                                <Typography variant="h6">
                                    {this.props.title}
                                </Typography> :
                                <div style={{ display: "flex" }}>
                                    <Icon classes={{ root: classes.icon }}>
                                        <Search />
                                    </Icon>
                                    <TextField
                                        inputRef={c => this._search = c}
                                        value={this.props.onSearchChanged ? this.props.search : this.state.search}
                                        onKeyUp={e => {
                                            if (e.key === "Escape") {
                                                if (this.props.search !== undefined) {
                                                    this.setState({ table: { ...this.state.table, page: 0 }, searching: false },
                                                        () => this.props.onSearchChanged(""));
                                                } else {
                                                    this.setState({
                                                        searching: false,
                                                        table: {
                                                            ...this.state.table,
                                                            search: ""
                                                        }
                                                    }, () => this._fetch());
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            var searchVal = e.currentTarget.value;
                                            if (this.props.search !== undefined) {
                                                this.setState({ table: { ...this.state.table, page: 0 } }, () => this.props.onSearchChanged(searchVal));
                                            } else {
                                                this.setState({
                                                    table: {
                                                        ...this.state.table,
                                                        page: 0,
                                                        search: searchVal
                                                    },
                                                }, () => this._fetch());
                                            }
                                        }}
                                    />
                                    {
                                        this.props.title &&
                                        <IconButton
                                            onClick={e => {
                                                if (this.props.search !== undefined) {
                                                    this.setState({ table: { ...this.state.table, page: 0 }, searching: false },
                                                        () => this.props.onSearchChanged(""));
                                                } else {
                                                    this.setState({
                                                        searching: this.props.false,
                                                        table: {
                                                            ...this.state.table,
                                                            search: ""
                                                        }
                                                    }, () => this._fetch());
                                                }
                                            }}
                                        >
                                            <Clear />
                                        </IconButton>
                                    }
                                </div>
                        }
                        {
                            !this.props.title &&
                            this.props.disableSearch &&
                            currentFilters.length > 0 &&
                            <div style={{ display: "flex", paddingLeft: 24, flexWrap: 'wrap' }}>
                                {
                                    currentFilters.map(f =>
                                        <Box key={"col-" + f.column} display="flex" alignItems="center" mr={1} flexWrap="wrap">
                                            <Typography variant="body2" color="textSecondary">{this.state.table.columns.find(tc => tc.name === f.column) ? this.state.table.columns.find(tc => tc.name === f.column).label : f.label}:</Typography>
                                            {
                                                {
                                                    'bool': <Chip
                                                        key={"col-" + f.column + "-chip"}
                                                        style={{ marginLeft: 8, marginBottom: 8 }}
                                                        label={f.checked ? 'Да' : 'Нет'}
                                                        onDelete={() => { this._deleteFilter(f, 'checked'); }}
                                                    />,
                                                    'number': <>
                                                        {f.min && <Chip
                                                            key={"col-" + f.column + "-chip-min"}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={"Больше " + f.min}
                                                            onDelete={() => { this._deleteFilter(f, 'min'); }}
                                                        />}
                                                        {f.max && <Chip
                                                            key={"col-" + f.column + "-chip-max"}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={"Меньше " + f.max}
                                                            onDelete={() => { this._deleteFilter(f, 'max'); }}
                                                        />}</>,
                                                    'date': <>
                                                        {f.start && <Chip
                                                            key={"col-" + f.column + "-chip-start"}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={"Позже " + moment(f.start).format('L')}
                                                            onDelete={() => { this._deleteFilter(f, 'start'); }}
                                                        />}
                                                        {f.end && <Chip
                                                            key={"col-" + f.column + "-chip-end"}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={"Раньше " + moment(f.end).format('L')}
                                                            onDelete={() => { this._deleteFilter(f, 'end'); }}
                                                        />}</>,
                                                    null: f.value.map((fv, fvInd) =>
                                                        <Chip
                                                            key={"col-" + f.column + "-chip-" + fvInd}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={fv}
                                                            onDelete={() => { this._deleteFilter(f, fv); }}
                                                        />),
                                                    undefined: f.value.map((fv, fvInd) =>
                                                        <Chip
                                                            key={"col-" + f.column + "-chip-" + fvInd}
                                                            style={{ marginLeft: 8, marginBottom: 8 }}
                                                            label={fv}
                                                            onDelete={() => { this._deleteFilter(f, fv); }}
                                                        />)
                                                }[f.type]
                                            }
                                        </Box>
                                    )
                                }
                            </div>
                        }
                        <Box display="flex">
                            {
                                this.props.customToolbar
                            }
                            {
                                this.props.disableSearch !== true &&
                                this.props.title &&
                                <IconButton onClick={() => this.setState({ searching: true }, () => this._search.focus())}>
                                    <Search color={this.state.searching ? "primary" : undefined} />
                                </IconButton>
                            }
                            {
                                this.props.onDownloadUrl &&
                                <IconButton
                                    onClick={async () => {
                                        this.props.showLoader && this.props.showLoader();
                                        let data;
                                        if (this.props.downloadWithFilters) {
                                            let tableState = { ...this.state.table };

                                            let options = {
                                                rowsPerPage: 0,
                                                page: 0,
                                                search: this.props.search || tableState.search,
                                                sort: this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : tableState.sort,
                                                filters: this.props.onFilterChanged ? (this.props.initialFilters ? this.props.initialFilters : tableState.filters) : tableState.filters,
                                                columns,
                                                headRows: this.props.headRows
                                            };
                                            data = await HttpUtil.fetchAsync(this.props.onDownloadUrl, options, "POST");
                                        } else {
                                            data = await HttpUtil.fetchGetAsync(this.props.onDownloadUrl);
                                        };

                                        if (data.error) {
                                            alert(data.error);
                                        } else {
                                            var reqFile = data.file;
                                            var file = CreateFile(reqFile, this.props.mimeType || 'text/csv;charset=utf-8');
                                            var element = document.createElement('a');
                                            var fName = data.name ||
                                                this.props.downloadName + new Date().toLocaleString("ru-RU").replace(", ", "").replace(/\./g, "").replace(/:/g, "") + ".csv";
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
                                        this.props.stopLoader && this.props.stopLoader();
                                    }}
                                >
                                    <GetApp />
                                </IconButton>
                            }
                            {
                                this.props.onDownload &&
                                <IconButton
                                    onClick={() => {
                                        let tableState = { ...this.state.table };

                                        let options = {
                                            rowsPerPage: 0,
                                            page: 0,
                                            search: this.props.search || tableState.search,
                                            sort: this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : tableState.sort,
                                            filters: this.props.onFilterChanged ? (this.props.initialFilters ? this.props.initialFilters : tableState.filters) : tableState.filters,
                                            columns,
                                            headRows: this.props.headRows
                                        };

                                        this.props.onDownload(options);
                                    }}
                                >
                                    <GetApp />
                                </IconButton>
                            }
                            {
                                this.state.table.sections &&
                                <IconButton
                                    buttonRef={c => this._sections = c}
                                    onClick={() => this.setState({ sectionsOpen: true })}
                                >
                                    <ViewColumn />
                                </IconButton>
                            }
                            {
                                filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).length > 0 &&
                                <IconButton
                                    buttonRef={c => this._menuButton = c}
                                    onClick={() => this.setState({ filterOpen: true })}
                                >
                                    <FilterList />
                                </IconButton>
                            }
                            <Popover
                                anchorEl={this._sections}
                                open={this.state.sectionsOpen}
                                anchorOrigin={{ vertical: 50, horizontal: -200 }}
                                onClose={() => this.setState({ sectionsOpen: false })}
                                classes={{
                                    paper: classes.paperMenu
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="body2">СЕКЦИИ</Typography>
                                </div>
                                {
                                    this.state.table.sections && this.state.table.columns.filter(c => c.options && c.options.sectionFilterLabel).map((c, i) =>
                                        <Box display="flex" alignItems="center" mt="10px" key={"sect" + i}>
                                            <Checkbox
                                                color="secondary"
                                                checked={this.state.table.sections[c.options.section].expanded}
                                                onChange={e => this.setState({
                                                    table: {
                                                        ...this.state.table,
                                                        sections: {
                                                            ...this.state.table.sections,
                                                            [c.options.section]: {
                                                                ...this.state.table.sections[c.options.section],
                                                                expanded: !this.state.table.sections[c.options.section].expanded
                                                            }
                                                        }
                                                    }
                                                })}
                                            />
                                            <Box width="275px" ml="16px">
                                                <Typography variant="body2">{c.options.sectionFilterLabel}</Typography>
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Popover>
                            <Popover
                                anchorEl={this._menuButton}
                                open={this.state.filterOpen}
                                anchorOrigin={{ vertical: 50, horizontal: -200 }}
                                onClose={() => this.setState({ filterOpen: false })}
                                classes={{
                                    paper: classes.paperMenu
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="body2">ФИЛЬТРЫ</Typography>
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        style={{ fontSize: 12, padding: "6px 8px" }}
                                        onClick={() => {
                                            if (this.props.onFilterChanged) {
                                                this.props.onFilterChanged([])
                                                this.setState({
                                                    table: {
                                                        ...this.state.table,
                                                        filters: [],
                                                        page: 0
                                                    }
                                                }, () => this._fetch());
                                            } else {
                                                this.setState({
                                                    table: {
                                                        ...this.state.table,
                                                        filters: [],
                                                        page: 0
                                                    }
                                                }, () => this._fetch());
                                            }
                                        }}
                                    >
                                        СБРОСИТЬ
                                </Button>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", marginLeft: -16 }} >
                                    {
                                        filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).map((filter, i) =>
                                            <Filter
                                                classes={classes}
                                                key={"tab-filt-" + i}
                                                c={this.state.table.columns.find(c => c.name === filter.column)}
                                                changeFilter={this._changeFilter}
                                                getFilterValue={this._getFilterValue}
                                                currentFilter={currentFilters.find(currentFilter => currentFilter.column === filter.column)}
                                                filter={filter}
                                                multiFilter={this.props.multiFilter}
                                            />
                                        )
                                    }
                                </div>
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
                                    c={this.state.table.columns.find(c => c.name === filter.column)}
                                    changeFilter={this._changeFilter}
                                    getFilterValue={this._getFilterValue}
                                    currentFilter={currentFilters.find(currentFilter => currentFilter.column === filter.column)}
                                    filter={filter}
                                    multiFilter={this.props.multiFilter}
                                />
                            )
                        }
                    </div>
                }
                {
                    (this.props.title || !this.props.disableSearch) &&
                    currentFilters.length > 0 &&
                    <div style={{ display: "flex", paddingLeft: 24, flexWrap: 'wrap' }}>
                        {
                            currentFilters.map(f =>
                                <Box key={"col-" + f.column} display="flex" alignItems="center" mr={1} flexWrap="wrap">
                                    <Typography variant="body2" color="textSecondary">{this.state.table.columns.find(tc => tc.name === f.column) ? this.state.table.columns.find(tc => tc.name === f.column).label : f.label}:</Typography>
                                    {
                                        {
                                            'bool': <Chip
                                                key={"col-" + f.column + "-chip"}
                                                style={{ marginLeft: 8, marginBottom: 8 }}
                                                label={f.checked ? 'Да' : 'Нет'}
                                                onDelete={() => { this._deleteFilter(f, 'checked'); }}
                                            />,
                                            'number': <>
                                                {f.min && <Chip
                                                    key={"col-" + f.column + "-chip-min"}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={"Больше " + f.min}
                                                    onDelete={() => { this._deleteFilter(f, 'min'); }}
                                                />}
                                                {f.max && <Chip
                                                    key={"col-" + f.column + "-chip-max"}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={"Меньше " + f.max}
                                                    onDelete={() => { this._deleteFilter(f, 'max'); }}
                                                />}</>,
                                            'date': <>
                                                {f.start && <Chip
                                                    key={"col-" + f.column + "-chip-start"}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={"Позже " + moment(f.start).format('L')}
                                                    onDelete={() => { this._deleteFilter(f, 'start'); }}
                                                />}
                                                {f.end && <Chip
                                                    key={"col-" + f.column + "-chip-end"}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={"Раньше " + moment(f.end).format('L')}
                                                    onDelete={() => { this._deleteFilter(f, 'end'); }}
                                                />}</>,
                                            null: f.value.map((fv, fvInd) =>
                                                <Chip
                                                    key={"col-" + f.column + "-chip-" + fvInd}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={fv}
                                                    onDelete={() => { this._deleteFilter(f, fv); }}
                                                />),
                                            undefined: f.value.map((fv, fvInd) =>
                                                <Chip
                                                    key={"col-" + f.column + "-chip-" + fvInd}
                                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                                    label={fv}
                                                    onDelete={() => { this._deleteFilter(f, fv); }}
                                                />)
                                        }[f.type]
                                    }
                                </Box>
                            )
                        }
                    </div>
                }
                <Box style={{ maxHeight: `calc(100vh - ${this.props.maxHeight}px)` }} overflow="auto">
                    <Table
                        className={classes.table}
                        size={this.props.small ? "small" : 'medium'}
                        style={{ minWidth: this.props.minWidth, overflowX: this.props.overflow ? "auto" : undefined, borderCollapse: this.props.stickyHeader ? "separate" : null, borderSpacing: this.props.stickyHeader ? 0 : null }}
                    >
                        <TableHead>
                            {
                                this.props.headRows ?
                                    headRows.map((r, index) => {
                                        return <TableRow key={"table-row-" + index}>
                                            {
                                                index === 0 &&
                                                this.props.select &&
                                                this.props.select === true &&
                                                <TableCell style={{ zIndex: 1, padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                    <Checkbox
                                                        checked={this.state.table.selectedRows.length > 0 && this.state.table.selectedRows.length === this.state.filteredData.length}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                this.setState({
                                                                    table: {
                                                                        ...this.state.table,
                                                                        selectedRows: this.state.filteredData
                                                                    }
                                                                }, () => {
                                                                    this.props.onRowSelect && this.props.onRowSelect(this.state.filteredData)
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    table: {
                                                                        ...this.state.table,
                                                                        selectedRows: []
                                                                    }
                                                                }, () => {
                                                                    this.props.onRowSelect && this.props.onRowSelect([])
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            }
                                            {index === 0 && this.props.showRowNums &&
                                                <TableCell key="hd0" rowSpan={headRows.length} style={{ zIndex: 1, padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                            }
                                            {
                                                r.map((c, i) => {
                                                    var sort = this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : this.state.table.sort;
                                                    return <HeadCell
                                                        sections={this.state.table.sections}
                                                        key={"hd1" + i}
                                                        column={c}
                                                        classes={classes}
                                                        sorted={sort.find(s => s.column === c.name)}
                                                        sort={this._sortAsync} small={this.props.small}
                                                        sortIndex={sort.length < 2 ? undefined : sort.map(s => s.column).indexOf(c.name)}
                                                    />
                                                })
                                            }
                                        </TableRow>;
                                    })
                                    : <TableRow>
                                        {
                                            this.props.select &&
                                            this.props.select === true &&
                                            <TableCell style={{ zIndex: 1, padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                <Checkbox
                                                    checked={this.state.table.selectedRows.length > 0 && this.state.table.selectedRows.length === this.state.filteredData.length}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            this.setState({
                                                                table: {
                                                                    ...this.state.table,
                                                                    selectedRows: this.state.filteredData
                                                                }
                                                            }, () => {
                                                                this.props.onRowSelect && this.props.onRowSelect(this.state.filteredData)
                                                            })
                                                        } else {
                                                            this.setState({
                                                                table: {
                                                                    ...this.state.table,
                                                                    selectedRows: []
                                                                }
                                                            }, () => {
                                                                this.props.onRowSelect && this.props.onRowSelect([])
                                                            })
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        }
                                        {
                                            this.props.showRowNums &&
                                            <TableCell key="hd0" style={{ zIndex: 1, padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                        }
                                        {
                                            columns.map((c, i) => {
                                                var sort = this.props.onSortingChanged && this.props.disableSortProps !== true ? this.props.sort : this.state.table.sort;
                                                return <HeadCell
                                                    sections={this.state.table.sections}
                                                    key={"hd2" + i}
                                                    column={c}
                                                    classes={classes}
                                                    sorted={sort.find(s => s.column === c.name)}
                                                    sort={this._sortAsync}
                                                    small={this.props.small}
                                                    sortIndex={sort.length < 2 ? undefined : sort.map(s => s.column).indexOf(c.name)}
                                                />;
                                            })
                                        }
                                    </TableRow>
                            }
                            {
                                this.props.showColNums &&
                                <TableRow>
                                    {
                                        this.props.showRowNums &&
                                        <TableCell key="hd0" style={{ zIndex: 1, padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>1</TableCell>
                                    }
                                    {
                                        columns.filter(c => !c.options || !c.options.onlyHead).map((c, i) => {
                                            return <TableCell key={c.name} style={{
                                                ...(c.options && c.options.customHeadStyle),
                                                padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                display: (c.options && c.options.section && !this.state.table.sections[c.options.section].expanded) ? "none" : null,
                                                zIndex: 1
                                            }}>
                                                {i + (this.props.showRowNums ? 2 : 1)}
                                            </TableCell>;
                                        }
                                        )
                                    }
                                </TableRow>
                            }
                        </TableHead>
                        <TableBody>
                            {
                                this.state.isLoading ?
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length + (this.props.showRowNums ? 1 : 0) + (this.props.select ? 1 : 0)}
                                            style={{ textAlign: "center", height: 36 }}
                                        >
                                            Загрузка...
                                    </TableCell>
                                    </TableRow> :
                                    (typeof (this.props.data) === "object" ? rows.length === 0 : this.state.rows.length === 0) ?
                                        <TableRow fullWidth>
                                            <TableCell
                                                colSpan={columns.length + (this.props.showRowNums ? 1 : 0) + (this.props.select ? 1 : 0)}
                                                style={{ textAlign: "center", height: 36 }}
                                            >
                                                {this.props.noDataMessage || 'Нет данных для отображения'}
                                            </TableCell>
                                        </TableRow> :
                                        (typeof (this.props.data) === "object" ? rows : this.state.rows).map((n, rowI) =>
                                            <TableRow
                                                hover={this.props.onRowClick != null}
                                                style={{
                                                    cursor: this.props.onRowClick ? "pointer" : "default",
                                                    backgroundColor: this.props.color ? this.props.color(n) : "normal",
                                                    display: !n.totalId || this.state.openTotals.includes(n.totalId) ? "table-row" : "none"
                                                }}
                                                className={this.props.stripedRows && rowI % 2 ? classes.stripedRow : null}
                                                key={"row" + n.id}
                                                onClick={e => {
                                                    !n.totalRow && this.props.onRowClick && this.props.onRowClick(n);
                                                }}
                                            >
                                                {
                                                    this.props.select &&
                                                    this.props.select === true &&
                                                    <TableCell key={"checkbox" + n.id} style={{ padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                        <Checkbox
                                                            checked={!!this.state.table.selectedRows.find(sc => sc[idField] === n[idField])}
                                                            onChange={async (event) => {
                                                                if (event.target.checked) {
                                                                    let selected = [...this.state.table.selectedRows]
                                                                    selected.push(n);
                                                                    this.setState({
                                                                        table: {
                                                                            ...this.state.table,
                                                                            selectedRows: selected
                                                                        }
                                                                    }, () => {
                                                                        this.props.onRowSelect && this.props.onRowSelect(this.state.table.selectedRows)
                                                                    })
                                                                } else {
                                                                    let selected = [...this.state.table.selectedRows].filter(sc => sc[idField] !== n[idField])
                                                                    this.setState({
                                                                        table: {
                                                                            ...this.state.table,
                                                                            selectedRows: selected
                                                                        }
                                                                    }, () => {
                                                                        this.props.onRowSelect && this.props.onRowSelect(this.state.table.selectedRows)
                                                                    })
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                }
                                                {
                                                    this.props.showRowNums && !n.totalRow &&
                                                    <TableCell key={"row-" + n.id + "-number"} style={{ padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>{rowNumber++}</TableCell>
                                                }
                                                {
                                                    n.totalRow && !this.props.totalRow &&
                                                    <TableCell>
                                                        <IconButton aria-label="expand row" size="small" onClick={() => this._toggleTotal(n.id)}>
                                                            {this.state.openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                }
                                                {
                                                    columns.filter(c => { return !c.options || !c.options.onlyHead }).map((c, i) =>
                                                        n.totalRow && c.name === this.props.totalRow ?
                                                            <TableCell>
                                                                <IconButton aria-label="expand row" size="small" onClick={() => this._toggleTotal(n.id)}>
                                                                    {this.state.openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                </IconButton>
                                                            </TableCell> :
                                                            <TableCell key={"row-" + n.id + "-column-" + c.name}
                                                                style={{
                                                                    display: (c.options && c.options.section && !this.state.table.sections[c.options.section].expanded) ? "none" : null,
                                                                    padding: this.props.small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                                    paddingRight: i === columns.length - 1 ? 16 : 4,
                                                                    backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                                                                    fontWeight: n.totalRow ? "bold" : "inherit"
                                                                }}
                                                            >
                                                                {c.options && c.options.customBodyRender ? c.options.customBodyRender(n[c.name], n, this) : dateFormat.test(n[c.name]) ? moment(n[c.name]).format('L') : n[c.name]}
                                                            </TableCell>
                                                    )
                                                }
                                            </TableRow>
                                        )}
                        </TableBody>
                    </Table>
                </Box>
                {
                    !this.props.disablePaging === true &&
                    <TablePagination
                        component="div"
                        count={typeof (this.props.data) === "object" ? total : this.state.total}
                        rowsPerPageOptions={this.props.rowsPerPageOptions || [10, 25, 50, 100]}
                        rowsPerPage={this.state.table.rowsPerPage}
                        labelRowsPerPage="Строк на странице"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                        page={this.state.table.page}
                        backIconButtonProps={{
                            'aria-label': 'Пред. страница',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'След. страница',
                        }}
                        onChangePage={(event, page) => this.setState({ table: { ...this.state.table, page } }, () => this._fetch())}
                        onChangeRowsPerPage={event => this.setState({ table: { ...this.state.table, rowsPerPage: event.target.value, page: 0 } }, () => this._fetch())}
                    />
                }
            </Paper>
        </div>;
    }
}

const styles = {
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
}

export default withStyles(styles)(CustomTable);

CustomTable.propTypes = {
    showLoader: PropTypes.func,
    stopLoader: PropTypes.func,
    onSearchChanged: PropTypes.func,
    onFilterChanged: PropTypes.func,
    onDownload: PropTypes.func,
    onSortingChanged: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['asc', 'desc']),
    onDownloadUrl: PropTypes.string,
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
    disableSortProps: PropTypes.bool,
    overflow: PropTypes.bool,
    filters: PropTypes.array,
    sort: PropTypes.arrayOf(PropTypes.instanceOf(SortClass)),
    rowCount: PropTypes.number,
    initialFilters: PropTypes.arrayOf(PropTypes.instanceOf(FilterClass)),
    columns: PropTypes.arrayOf(PropTypes.instanceOf(ColumnClass))
};

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
}

FilterClass.propTypes = {
    columnn: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string)
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

class ColumnOptionsClass {
    display;
    type;
    sort;
    trasformData;
    customHeadRender;
    customBodyRender;
}

ColumnOptionsClass.propTypes = {
    display: PropTypes.bool,
    type: PropTypes.oneOf(['array']),
    sort: PropTypes.bool,
    trasformData: PropTypes.func,
    customHeadRender: PropTypes.func,
    customBodyRender: PropTypes.func,
}