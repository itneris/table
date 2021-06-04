import React, { Component } from "react";
import {
    Typography,
    Box,
    Checkbox,
    Tooltip,
    LinearProgress,
    FormControlLabel,
} from "@material-ui/core";
import CustomTable from "../components/CustomTable";
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@material-ui/core/styles";
import data, { dictionary } from "../test_data/data";
import { HelpOutline } from "@material-ui/icons";

const columns = classes => [
    {
        name: "id",
        options: {
            display: false
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
            globalLoading: false,
            filters: [{ column: "ingridients", value: [ "Beer" ] }],
            search: "",
            sorting: [{ column: "createDate", dir: "desc" }]
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
           
            <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                <Typography variant="h6">
                    ClientSide table
                </Typography>
                <FormControlLabel
                    control={<Checkbox
                        checked={this.state.multiFilter}
                        onChange={() => this.setState({ multiFilter: !this.state.multiFilter })}
                    />}
                    label="Enable multifilter"
                />                
            </Box>
            <CustomTable
                data={data}
                filterList={demoFilterList}
                multiFilter={this.state.multiFilter}
                rowCount={10}
                sortBy="name"
                sortDir="asc"
                columns={columns(this)}
            />
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