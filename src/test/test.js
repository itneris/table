import React, { Component } from "react";
import {
    Typography,
    Box,
} from "@material-ui/core";
import CustomTable from "./const/CustomTable";
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@material-ui/core/styles";

const columns = classes => [
    {
        name: "id",
        options: {
            display: false
        }
    },
    {
        name: "userName",
        label: "Логин",
        options: {
            customBodyRender: (value) => <div style={{ fontWeight: "bold" }}>{value}</div>
        }
    },
    {
        name: "surname",
        label: "Фамилия"
    },
    {
        name: "role",
        label: "Группа",
        options: {
            customBodyRender: (value) => <div style={{ fontWeight: "bold" }}>{value}</div>
        }
    },
    {
        name: "modified",
        label: "Изменено",
        options: {
            customBodyRender: (value) => ToRuDate(value, true),
            sortDirection: "desc"
        }
    },
    {
        name: "status",
        label: "Статус",
        options: {
            customBodyRender: (value) => <div style={{ fontWeight: "bold" }}>{value}</div>,
            customHeadRender: (classes) => <Box display="flex" alignItems="center">
                Статус
                <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title='Пользователи, характеризующиеся статусом = "Блокирован", не имеют возможности войти в систему'
                >
                    <HelpOutline className={classes.question} />
                </Tooltip>
            </Box>
        }
    }
];

class TestComnonent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            globalLoading
        };
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
                //data="api/Users/List"
                //filterList="api/Users/GetFilters"
                columns={columns(classes)}
                onRowClick={(n) => this.setState({ modal: n.id })}
                sort={this.props.sorting}
                search={this.props.search}
                onSearchChanged={(searchVal) => this.props.changeSearch(searchVal)}
                onFilterChanged={(filter) => this.props.changeFilters(filter)}
                initialFilters={this.props.filters}
                onSortingChanged={(sort) => this.props.changeSorting(sort)}
            />
            <Box alignItems="center" display="flex" mb="20px" justifyContent="space-between">
                <Typography variant="h6">
                    ClientSide table
                </Typography>
            </Box>
            <CustomTable
                data={this.state.rows}
                filterList={[
                    { column: "status", value: ["Блокирована", "Активна"] },
                ]}
                sortBy="date"
                sortDir="desc"
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