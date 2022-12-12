import React, { useMemo, useRef, useState } from "react";
import {
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
} from "@mui/material";
//import ItnTable, { AbstractColumnBuilder } from "@itneris/table";
import ItnTable, { AbstractColumnBuilder } from "../table/src";
import demo from "../test_data/data";
import { ITableRef } from "../table/src/base/ITableRef";

interface ICocktailDTO {
    id: string;
    name: string;
    price: number;
    ingridients: string[];
    createDate: Date | null;
    glassType: number;
}

class ServerCocktailsColumnBuilder extends AbstractColumnBuilder<ICocktailDTO> {
    constructor() {
        super();
        this.ColumnFor(_ => _.name)
            .WithName("Наименование", true)
            .WithDefaultSort();

        this.ColumnFor(_ => _.price)
            .WithName("Цена");

        this.ColumnFor(_ => _.ingridients)
            .WithName("Ингридиенты");

        this.ColumnFor(_ => _.createDate)
            .WithName("Дата создания");

        this.ColumnFor(_ => _.glassType)
            .WithName("Тип стакана")
            .WithBodyRenderer((val) => {
                return <>{demo.cupDictionary.find(_ => _.id === val)?.label}</>;
            });
    }
}

export default function TestComnonent() {
    const serverTableRef = useRef<ITableRef | null>(null);
    //const [isFilterOr, setIsFilterOr] = useState(false);
    //const [globalLoading, setGlobalLoading] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [enableSelect, setEnableSelect] = useState(false);
    const [tab, setTab] = useState(0);

    //const changeFilters = filters => localStorage.setItem("filters", JSON.stringify(filters));
    //const changeSearch = search => localStorage.setItem("search", search);
    //const changeSorting = sorting => localStorage.setItem("sorting", JSON.stringify(sorting));

    const serverColumnBuilder = useMemo(() => {
        return new ServerCocktailsColumnBuilder();
    }, []);

    return <div>
        {/*
            globalLoading &&
            <LinearProgress color='secondary' className={classes.globalLoader} />
        */}
        <Tabs value={tab} onChange={(e, val) => setTab(val)}>
            <Tab label="Server" />
            <Tab label="Storage" />
            { /*<Tab label="Client" />
            <Tab label="Headers"/> */}
        </Tabs>

        {
            tab === 0 && <>
                <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                    <Typography variant="h6">
                        ServerSide
                    </Typography>
                    <Box alignItems="center" display="flex">
                        <FormControlLabel
                            control={<Checkbox
                                checked={showAction}
                                onChange={() => setShowAction(!showAction)}
                            />}
                            label="Enable action column"
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={enableSelect}
                                onChange={() => {
                                    setEnableSelect(!enableSelect);
                                    //serverTableRef.current!.setSelectedRows(['1', '2']);
                                }}
                            />}
                            label="Enable rows selection"
                        />
                    </Box>
                </Box>
                <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                    <Typography variant="h6">
                    </Typography>
                </Box>
                <ItnTable
                    ref={serverTableRef}
                    apiUrl="api/test"
                    onRowClick={() => console.log('row click')}
                    columnsBuilder={serverColumnBuilder}
                    enableRowsSelection={enableSelect ? (row => row.name !== "Beer") : false}
                    onRowSelect={(rows) => console.log(rows)}
                    selectedRows={!enableSelect ? [] : ['1', '2']}                    
                />
            </>
        }      
        {/*
            tab === 2 && <>
                <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                    <Typography variant="h6">
                        ClientSide table with context
                    </Typography>
                    <Box alignItems="center" display="flex">
                        <FormControlLabel
                            control={<Checkbox
                                checked={multiFilter}
                                onChange={() =>  setMultiFilter(!multiFilter)}
                            />}
                            label="Enable multifilter"
                        />                
                        <FormControlLabel
                            disabled={!multiFilter}
                            style={{ marginLeft: 16 }}
                            control={<Checkbox
                                checked={isFilterOr}
                                onChange={() => setIsFilterOr(!isFilterOr)}
                            />}
                            label='Filter type "OR"'
                        />                
                    </Box>
                </Box>
                <CustomTable
                    data={demo.data}
                    filterList={demoFilterList}
                    multiFilter={multiFilter}
                    rowCount={10}
                    stripedRows={true}
                    sort={[{ column: "name", dir: "asc" }]}
                    columns={columns(classes, false, isFilterOr ? "or" : "and")}
                    searchProps={{
                        variant: 'outlined',
                        margin: 'dense'
                    }}
                    context={[
                        { name: "showId", action: (id) => alert(id) },
                        {
                            name: "inner",
                            options: [
                                { name: "showId_1", action: (id) => alert("show1: " + id) },
                                { name: "showId_2", action: (id) => alert("show2: " + id) }
                            ]
                        },
                    ]}
                />
            </>
        */}

        {/*
            tab === 3 && <>
                <Typography variant="h6">
                    Table with custom headers
                </Typography>
                <CustomTable
                    data={demo.data}
                    totalRow="rowNumber"
                    rowCount={100}
                    maxHeight={200}
                    minWidth={2000}
                    noDataMessage="No data"
                    stickyHeader
                    small
                    sort={[
                        { column: 'glassType', dir: 'asc' },
                        { column: 'name', dir: 'asc' }
                    ]}
                    showColNums={true}
                    disablePaging={true}
                    overflow
                    columns={columnsMultiheader(classes)}
                    sortBy="id"
                    sortDir="asc"
                    headRows={2}
                    sections={{
                        1: {
                            expanded: true
                        },
                        2: {
                            expanded: true
                        },
                    }}
                    customToolbar={
                        <Box alignItems="center" display="flex">
                            <Button
                                style={{ height: 36, marginRight: 16 }}
                                variant='contained'
                                color='secondary'
                                onClick={() => alert("Button 1 clicked")}
                            >
                                Alert 1
                            </Button>
                            <Button
                                style={{ height: 36, marginRight: 16 }}
                                variant='contained'
                                color='secondary'
                                onClick={() => alert("Button 2 clicked")}
                            >
                                Alert 2
                            </Button>
                        </Box>
                    }
                />
            </>
        */}
        {/*
            tab === 1 && <>
                <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                    <Typography variant="h6">
                        Local storage browser demo
                    </Typography>
                </Box>
                <CustomTable
                    data={demo.data}
                    columns={columns(classes)}
                    filterList={demoFilterList}
                    search={localStorage.getItem("search") || ""}
                    sort={JSON.parse(localStorage.getItem("sorting")) || []}
                    filters={JSON.parse(localStorage.getItem("filters")) || []}
                    onSearchChanged={changeSearch}
                    onFilterChanged={changeFilters}
                    onSortingChanged={changeSorting}
                    rowCount={10}
                />
            </>
        */}
    </div>;
}