import React, { useMemo, useState } from "react";
import {
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
} from "@mui/material";
import ItnTable, { AbstractColumnBuilder } from "@itneris/table";
import demo from "../test_data/data";
import { useQueryClient } from "@tanstack/react-query";

/*const columns = (isServer: boolean, filterType) => [
    {
        name: "id",
        options: {
            display: false
        }
    },
    {
        name: "glassType",
        label: "Type",
        options: {
            customHeadRender: () => <Box display="flex" alignItems="center">
                Type
                <Tooltip
                    title='Glass type of cocktail'
                >
                    <HelpOutline />
                </Tooltip>
            </Box>,
            customBodyRender: isServer ? undefined : v => (demo as any).dictionary.find((_ : any) => _.id === v).label,
            transformData: isServer ? undefined : v => (demo as any).dictionary!.find((_: any) => _.id === v).label
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
            customBodyRender: (value: string) => <div style={{ fontWeight: "bold" }}>{value}</div>
        }
    },
    {
        name: "price",
        label: "Price, $"
    },
    {
        name: "ingridients",
        label: "Ingridients",
        options: {
            sort: false,
            type: "array",
            filterType: filterType,
            customBodyRender: v => v.join(", "),
        }
    },
    {
        name: "createDate",
        label: "Creation Date",
        options: {
            customBodyRender: (v: string|null) => v ? new Date(v).toLocaleDateString() : "-",
            transformData: (v: string|null) => v ? "Known" : "Unknown"
        }
    }
];

const columsWithAction = (classes, isServer, filterType) => [
    ...columns(classes, isServer, filterType), {
        name: "action",
        label: "Actions",
        options: {
            sort: false,
            customBodyRender: (v, row) => <Button
                color="secondary"
                variant="text"
                onClick={() => alert(row.id)}
            >
                Show ID
            </Button>
        }
    }
];

const columnsMultiheader = [
    {
        name: "id",
        options: {
            display: false
        }
    },
    {
        name: "rowNumber",
        label: "Group",
        options: {
            customBodyRender: (value: Date | null) => <div style={{ zIndex: 2 }}>{value ? value.toLocaleString('ru-RU') : value}</div>,
            headRow: 1,
            rowSpan: 2
        }
    },
    {
        name: "section1",
        label: "Section 1. Glass and name",
        options: {
            headRow: 1,
            rowSpan: 1,
            colSpan: 2,
            section: 1,
            onlyHead: true,
            sectionFilterLabel: "Section 1. Glass and name",
            customHeadStyle: { borderLeft: "3px solid rgba(224, 224, 224, 1)", fontWeight: "bold" }
        }
    },
    {
        name: "glassType",
        label: "Type",
        options: {
            headRow: 2,
            rowSpan: 1,
            section: 1,
            customHeadStyle: { borderLeft: "3px solid rgba(224, 224, 224, 1)" },
            customBodyRender: (v: string | null) => (demo as any).dictionary.find((_ : any) => _.id === v).label,
            transformData: (v: string | null) => (demo as any).dictionary.find((_: any) => _.id === v).label
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
            headRow: 2,
            rowSpan: 1,
            section: 1,
            customBodyRender: (value: string) => <div style={{ fontWeight: "bold" }}>{value}</div>
        }
    },
    {
        name: "section2",
        label: "Section 2. Bar",
        options: {
            headRow: 1,
            rowSpan: 1,
            colSpan: 2,
            section: 2,
            onlyHead: true,
            sectionFilterLabel: "Section 2. Bar",
            customHeadStyle: { borderLeft: "3px solid rgba(224, 224, 224, 1)", fontWeight: "bold" }
        }
    },
    {
        name: "price",
        label: "Price, $",
        options: {
            headRow: 2,
            rowSpan: 1,
            section: 2,
            customHeadStyle: { borderLeft: "3px solid rgba(224, 224, 224, 1)" }
        }
    },
    {
        name: "ingridients",
        label: "Ingridients",
        options: {
            sort: false,
            type: "array",
            customBodyRender: v => v.join(", "),
            headRow: 2,
            rowSpan: 1,
            section: 2
        }
    },
    {
        name: "createDate",
        label: "Creation Date",
        options: {
            headRow: 1,
            rowSpan: 2,
            customHeadStyle: { borderLeft: "3px solid rgba(224, 224, 224, 1)" },
            customBodyRender: v => v ? ToRuDate(v, false) : "-",
            transformData: v => v ? "Known" : "Unknown",
        }
    }
];
*/
/*const demoFilterList: Array<FilterProperties> = [
    {
        column: "glassType",
        values: demo.dictionary.map(_ => _.label).sort(),
        type: 0
    },
    {
        column: "ingridients",
        values: ["Beer", "Jhin", "Vodka", "Tequila", "Vermut", "Rum", "Cuantro", "Cola", "Liquor", "Juice", "Wine", "Apperetivo", "Jager", "Blue Curasao"].sort(),
        type: 0
    },
    {
        column: "createDate",
        values: ["Known", "Unknown"],
        type: 0 }
];*/


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
            .WithName("Наименование", true);

        this.ColumnFor(_ => _.price)
            .WithName("Цена");

        this.ColumnFor(_ => _.ingridients)
            .WithName("Ингридиенты");

        this.ColumnFor(_ => _.createDate)
            .WithName("Дата создания");

        this.ColumnFor(_ => _.glassType)
            .WithName("Тип стакана")
            .WithBodyRenderer((val) => {
                return <>{demo.dictionary.find(_ => _.id === val)?.label}</>;
            });
    }
}

export default function TestComnonent() {
    //const [isFilterOr, setIsFilterOr] = useState(false);
    //const [globalLoading, setGlobalLoading] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [tab, setTab] = useState(0);
    const queryClient = useQueryClient();

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
                    </Box>
                </Box>
                <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                    <Typography variant="h6">
                    </Typography>
                </Box>
                <ItnTable
                    //data="api/GetData"
                    //filterList="api/GetFilters"
                    apiUrl="test"
                    queryClient={queryClient}
                    //disableSearch={true}
                    //columns={showAction ? columsWithAction(classes, true) : columns(classes, true)}
                    columnsBuilder={serverColumnBuilder}
                    //pageSize={10}
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