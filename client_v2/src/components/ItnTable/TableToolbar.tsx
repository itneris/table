import React, { useContext, useRef, useState } from 'react';
import { Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { TableContext } from './Table';
import { Search } from '@mui/icons-material';
import TableSearch from './TableSearch';
import TablePanelFilterValue from './TablePanelFilterValue';
import { IFocusable } from '../base/IFocusable';

const TableToolbar = () => {
    const searchInputRef = useRef<IFocusable|null>(null);
    const tableCtx = useContext(TableContext)!;
    const [showSearch, setShowSearch] = useState<boolean>(tableCtx.title != null ? tableCtx.searching != "" : true);

    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {
                //Depend on settings show title or search input. Or if any filters just filter panel
                !showSearch ?
                    <Typography variant="h6">
                        {tableCtx.title}
                    </Typography> :
                    !tableCtx.disableSearch ?
                        <TableSearch setShowSearch={setShowSearch} ref={searchInputRef} /> :
                        tableCtx.filters.length ?
                            null :
                            <div></div>
            }
            {
                //Show panel with current filtering
                (!tableCtx.title && tableCtx.disableSearch && tableCtx.filtering.length) &&
                    <Box display="flex" flexWrap="wrap">
                        {
                            tableCtx.filtering.map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                        }
                    </Box>
            }
            <Box display="flex">
                {tableCtx.toolbarAdornment}
                {
                    (!tableCtx.disableSearch && tableCtx.title) &&
                    <Tooltip title={tableCtx.searchTooltipText}>
                        <IconButton onClick={() => { setShowSearch(true); searchInputRef.current?.focus() }}>
                            <Search color={showSearch ? "primary" : undefined} />
                        </IconButton>
                    </Tooltip>
                }
                {
                    (onDownload && typeof onDownload !== "function") &&
                    <Tooltip title={downloadTooltipText}>
                        <IconButton
                            onClick={async () => {
                                propShowLoader && propShowLoader();
                                reactContext && reactContext.setLoading(true);
                                let data;
                                if (downloadWithFilters) {
                                    let options = {
                                        rowsPerPage: table.rowsPerPage,
                                        page: table.page,
                                        search: table.search,
                                        sort: table.sort,
                                        filters: table.filters
                                    };
                                    //data = await HttpUtil.fetchAsync(onDownload, options, "POST", disableToken ? true : false);
                                } else {
                                    //data = await HttpUtil.fetchGetAsync(onDownload, null, disableToken ? true : false);
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
                                propStopLoader && propStopLoader();
                                reactContext && reactContext.setLoading(false);
                            }}
                        >
                            <GetApp />
                        </IconButton>
                    </Tooltip>
                }
                {
                    (onDownload && typeof onDownload === "function") &&
                    <Tooltip title={downloadTooltipText}>
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
                    </Tooltip>
                }
                {
                    enableColumnsHide &&
                    <Tooltip title="Отображение колонок">
                        <IconButton ref={columnsButtonElement} onClick={() => setColumnsOpen(true)}>
                            <ViewColumn />
                        </IconButton>
                    </Tooltip>
                }
                {
                    filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).length > 0 &&
                    <Tooltip title={filterTooltipText}>
                        <IconButton
                            ref={menuButtonElement}
                            onClick={() => setFilterOpen(true)}
                        >
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                }
                <Popover
                    anchorEl={columnsButtonElement.current}
                    open={columnsOpen}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    onClose={() => setColumnsOpen(false)}
                >
                    <Box p={2} maxHeight={400} maxWidth={800} minWidth={200}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2">КОЛОНКИ</Typography>
                        </div>
                        {
                            columns.filter(c => !c.options || !c.options.alwaysVisible).slice().sort(function (a, b) {
                                const nameA = a.label.toUpperCase();
                                const nameB = b.label.toUpperCase();
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                                return 0;
                            }).map((c, i) =>
                                <Box display="flex" alignItems="center" mt="10px" key={"sect" + i}>
                                    <Checkbox
                                        color="secondary"
                                        checked={columns.find(col => col.name === c.name)?.options?.display ?? true}
                                        onChange={() => {
                                            if (columns.find(col => col.name === c.name)?.options.display === undefined) {
                                                const newColumnsHide = columns.slice();
                                                newColumnsHide.find(col => col.name === c.name).options.display = true;
                                                setColumns(newColumnsHide);
                                            }
                                            else {
                                                const newColumnsHide = columns.slice();
                                                newColumnsHide.find(col => col.name === c.name).options.display = !columns.find(col => col.name === c.name).options.display
                                                setColumns(newColumnsHide);
                                            }
                                        }}
                                    />
                                    <Box width="275px" ml="16px">
                                        <Typography variant="body2">{c.label}</Typography>
                                    </Box>
                                </Box>
                            )
                        }
                    </Box>
                </Popover>
                <Popover
                    anchorEl={menuButtonElement.current}
                    open={filterOpen}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    onClose={() => setFilterOpen(false)}
                    componentsProps={{
                        paper: {
                            sx: {
                                padding: 16,
                                maxWidth: 800,
                                minWidth: 200
                            }
                        }
                    }}
                /*classes={{
                    paper: classes.paperMenu
                }}*/
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
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
                    <Box display="flex" flexWrap="wrap" ml="-16px" px={2}>
                        {
                            filters.filter(f => f.inToolbar === false || f.inToolbar === undefined).map((filter, i) =>
                                <Filter
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
    );
};

export default TableToolbar;