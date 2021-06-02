import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test/test';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                fontSize: "0.8125rem",
                fontWeight: 400,
                padding: "16px 56px 16px 24px",
                "&:last-child": {
                    paddingRight: "24px"
                }
            },
            head: {
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "grey"
            }
        },
        MUIDataTableBodyCell: {
            root: {
                fontSize: "0.8125rem",
                fontWeight: 400,
                padding: "16px 56px 16px 24px",
                "&:last-child": {
                    paddingRight: "24px"
                }
            }
        },
        MUIDataTableHeadCell: {
            root: {
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "grey",
                padding: "16px 56px 16px 24px",
                "&:last-child": {
                    paddingRight: "24px"
                }
            }
        },
        MUIDataTableBody: {
            emptyTitle: {
                fontSize: "0.8125rem"
            }
        },
        MuiTablePagination: {
            root: {
                color: "grey",
                fontSize: "0.75rem"
            },
            caption: {
                fontSize: "0.75rem"
            }
        }
    },
    palette: {
        background: {
            default: '#f1f1f1'
        },
        primary: {
            main: '#00838f',
            light: '#4fb3bf',
            dark: '#005662',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#0277bd',
            light: '#58a5f0',
            dark: '#004c8c',
            contrastText: '#ffffff'
        },
        text: {
            secondary: 'grey'
        }
    }
});

const rootElement = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Test />
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    </React.StrictMode>,
    rootElement);
