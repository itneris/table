const express = require('express');
const bodyParser = require('body-parser');
const demo = require('./client/src/test_data/data');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/GetData', (req, res) => {
    let tableState = req.body;
    let rows = demo.data.map(_ => ({
        ..._,
        glassType: demo.dictionary.find(d => d.id === _.glassType).label
    }));

    if (tableState.search) {
        rows = rows.filter(_ => _.name.toLowerCase().includes(tableState.search.toLowerCase()))
    };

    tableState.filters.forEach(_ => {
        rows = rows.filter(r => _.value.includes(r.glassType));
    });

    if (tableState.sort.length > 0) {
        rows = rows.sort(SortData(tableState.sort));
    }

    let total = rows.length;
    rows = rows.splice(tableState.page * tableState.rowsPerPage, tableState.rowsPerPage);

    res.send({
        rows,
        total
    });
});

app.get('/api/GetFilters', (req, res) => {
    let filters = [
        { column: "glassType", value: demo.dictionary.map(_ => _.label).sort() }
    ];
    res.send(filters);
});


app.listen(port, () => console.log(`Listening on port ${port}`));


function SortData(sort) {
    var fields = [].slice.call(sort.map(s => ({
        name: s.column,
        reverse: s.dir === "desc"
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