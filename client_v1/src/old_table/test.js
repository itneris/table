import React, { Component } from "react";
import {
    Typography,
    Box,
    Checkbox,
    Tooltip,
    LinearProgress,
    FormControlLabel,
    Button,
    Tabs,
    Tab,
} from "@material-ui/core";
import CustomTable from "../components/CustomTable";
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@material-ui/core/styles";
import data, { dictionary } from "../test_data/data";
import { HelpOutline } from "@material-ui/icons";

const columns = (classes, filterType) => [
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
                    classes={{ tooltip: classes.tooltip }}
                    title='Glass type of cocktail'
                >
                    <HelpOutline className={classes.question} />
                </Tooltip>
            </Box>,
            customBodyRender: v => dictionary.find(_ => _.id === v).label,
            transformData: v => dictionary.find(_ => _.id === v).label
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
            customBodyRender: (value) => <div style={{ fontWeight: "bold" }}>{value}</div>
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
            customBodyRender: v => v ? ToRuDate(v, false) : "-",
            transformData: v => v ? "Known" : "Unknown"
        }
    }
];

const columnsMultiheader = classes => [
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
            customBodyRender: (value) => <div style={{ zIndex: 2 }}>{value ? value.toLocaleString('ru-RU') : value}</div>,
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
            customBodyRender: v => dictionary.find(_ => _.id === v).label,
            transformData: v => dictionary.find(_ => _.id === v).label
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
            headRow: 2,
            rowSpan: 1,
            section: 1,
            customBodyRender: (value) => <div style={{ fontWeight: "bold" }}>{value}</div>
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

const demoFilterList = [
    { column: "glassType", value: dictionary.map(_ => _.label).sort() },
    { column: "ingridients", value: ["Beer", "Jhin", "Vodka", "Tequila", "Vermut", "Rum", "Cuantro", "Cola", "Liquor", "Juice", "Wine", "Apperetivo", "Jager", "Blue Curasao"].sort() },
    { column: "createDate", value: ["Known", "Unknown"] }
];

class TestComnonent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            multiFilter: true,
            isFilterOr: false,
            globalLoading: false,
            filters: [{ column: "ingridients", value: [ "Beer" ] }],
            search: "",
            sorting: [{ column: "createDate", dir: "desc" }],
            tab: 0
        };
    }

    changeFilters (filters) {
        this.setState({
            filters: filters
        })
    }

    changeSearch (search) {
        this.setState({
            search: search
        })
    }

    changeSorting (sorting) {
        this.setState({
            sorting: sorting
        })
    }

    render() {
        let { classes } = this.props;
        return <div>
            {
                this.state.globalLoading &&
                <LinearProgress color='secondary' className={classes.globalLoader} />
            }
            <Tabs value={this.state.tab} onChange={(e, val) => this.setState({ tab: val })}>
                <Tab label="Server" />
                <Tab label="Client" />
                <Tab label="Headers"/>
            </Tabs>        
            {
                this.state.tab === 0 && <>
                    <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                        <Typography variant="h6">
                            ServerSide with custom filters and sorting
                        </Typography>
                    </Box>            
                    <CustomTable
                        showLoader={() => this.setState({ globalLoading: true })}
                        stopLoader={() => this.setState({ globalLoading: false })}
                        data="api/GetTestData"
                        demoData = {data}
                        filterList="GetTestFilters"
                        demoFilterList={demoFilterList}
                        columns={columns(classes)}
                        //onRowClick={(n) => this.setState({ modal: n.id })}
                        sort={this.state.sorting}
                        search={this.state.search}
                        onSearchChanged={(searchVal) => this.changeSearch(searchVal)}
                        onFilterChanged={(filter) => this.changeFilters(filter)}
                        initialFilters={this.state.filters}
                        onSortingChanged={(sort) => this.changeSorting(sort)}
                        rowCount={10}
                    />
                </>
            }

            {
                this.state.tab === 1 && <>
                    <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                        <Typography variant="h6">
                            ClientSide table
                        </Typography>
                        <Box alignItems="center" display="flex">
                            <FormControlLabel
                                control={<Checkbox
                                    checked={this.state.multiFilter}
                                    onChange={() => this.setState({ multiFilter: !this.state.multiFilter })}
                                />}
                                label="Enable multifilter"
                            />                
                            <FormControlLabel
                                disabled={!this.state.multiFilter}
                                style={{ marginLeft: 16 }}
                                control={<Checkbox
                                    checked={this.state.isFilterOr}
                                    onChange={() => this.setState({ isFilterOr: !this.state.isFilterOr })}
                                />}
                                label='Filter type "OR"'
                            />                
                        </Box>
                    </Box>
                    <CustomTable
                        data={data}
                        filterList={demoFilterList}
                        multiFilter={this.state.multiFilter}
                        rowCount={10}
                        sortBy="name"
                        sortDir="asc"
                        columns={columns(this, this.state.isFilterOr ? "or" : "and")}
                    />
                </>
            }

            {
                this.state.tab === 2 && <>
                    <Typography variant="h6">
                        Table with custom headers
                    </Typography>
                    <CustomTable
                        data={data}
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
                        ref={c => this._table = c}
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
            }
        </div>;
    }
}

const styles = theme => ({
    globalLoader: {
        zIndex: 9999,
        width: '100%',
        position: 'fixed'
    },
});

export default withStyles(styles)(TestComnonent);