import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test/test';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const rootElement = document.getElementById('root');

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Test />
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>,
    rootElement);
