# ItNeris Table
Custom ItNeris company grid based on MaterialUI
____
## Content
1. [Common props](#Common-props)
2. [Client-side](#Client-side)
3. [Server-side](#Server-side)
4. [Column properties](#Column-properties)
5. [Custom actions and Redux compatability](#Custom-actions-and-Redux-compatability)
6. [Additional classes](#Additional-classes)
____
## Common props
1. **onDownload: function([options](#Table-options))** � �������� �� ������� �� ������ ����������
2. **sortBy: string** � ���� ������, �� ������� ��������� ���������� �������
3. **sortDir: "asc" || "desc"** � ���� ������, �� ����������� ��������� ���������� �������
4. **title: string** � ���� ������, �� ����� ������� ��������� �������� � ������� ������, � ��������� ������ ����� ����� ��������� ������
5. **mimeType: string** � mime-type ��� ����� �������� �������, �� ��������� _text/csv_
6. **showColNums: bool** � ����������� ������� ������� �������, �� �������� _false_
7. **disablePaging: bool** � �������� ��������� �������, �� �������� _false_
8.  **showRowNums: bool** � ����������� ������� ����� �������, �� �������� _false_
9.  **multiFilter: bool** � ��������� �������� ��������� �������� � �������� �������, �� �������� _false_
10. **disableSearch: bool** � ��������� ����������� ������ �� �������, �� �������� _false_
11. **disableSortProps: bool** � ��������� ��������� ���������� ���������� ������� � ���������� **onSortingChanged** ��� ��������� ������ ��������� �������� ����������, �� �������� _false_
```js
<Table
    data={this.state.tableData}
    sort={this.state.gridSort} //��������� �� �� ���������� ��� �������� ������������
    disableSortProps={true} //��������� ���������� ������ ���������� �������
    onSortingChanged={async (sort) => {
        //������� � �� ��������� ����������
        await HttpUtil.fetchAsync("/api/Users/ChangeEclSort", { sort: JSON.stringify(sort) }, "POST");
    }}
/>
```
12. **overflow: bool** � ��������� ������� ������������� �� ������� ������ �� ��� X �� �����������, �� �������� _false_
13. **rowCount: number** � ���������� ����� �� ��������, �� ��������� _25_
13. **columns: arrayOf([Column](#Column-properties))** � ������ ������� �������
## Client-side
1. **data: array** � ������ �������, ������ ����
```js
 [
    { id: 1, name: 'name 1', date: '2021-03-02T12:00:00' },
    { id: 2, name: 'name 2', date: '2021-03-03T15:00:00' },
 ]
```
2. **downloadName: string** � ������������ ����� �������� �������
3. **filterList: arrayOf([Filter](#Filter))** - ������ ��������� �������� ��� �������
____
## Server-side
1. **showLoader: function()** � ������� ��� ����������� ���������� �������� �� ����� ������� � �������
2. **stopLoader: function()** � ������� ��� ������� ���������� �������� �� ����� ������� � �������
3. **onDownloadUrl: string** � URL ��� ���������� GET ������� � ������� ��� ��������� [����� ��������](#File)
4. **downloadWithFilters: bool** � ���� true, �� ��� ��������� Blob ����� �������� POST ������ � ��������� [����� �������](#Table-options) � ���� �������
5. **data: string** � URL ��� ���������� POST ������� � ��������� [�����](#Table-options) � ���� �������, � ����� ������� ������ ����
```js
 [
    { id: 1, name: 'name 1', date: '2021-03-02T12:00:00' },
    { id: 2, name: 'name 2', date: '2021-03-03T15:00:00' },
 ]
```
6. **filterList: string** � URL ��� ���������� GET ������� � ������� ��� ��������� ������� ��������� [��������](#Filter)
____
## Column properties
1. **name: string** � ������������ ������� � ������� data �������
2. **label: string** � ����������� ������������ �������
3. **options**  � �������� ������
- **customBodyRender: function(value, row)** � ������ �������� �������, �������� �� � �������� � ������ � �����
```js
customBodyRender: value => <div style={{ fontWeight: "bold" }}>
        {value}
    </div>
```
- **customHeadRender: function()** � ������ ��������� �������
```js
customHeadRender: () => <Box display="flex" alignItems="center">
                ������
                <Tooltip title='���������'><HelpOutline /></Tooltip>
            </Box>
```
- **type: "array"** � ���� �����, �� �� ������� ����� ������������ ����� � ���������� ��� �� �������
- **trasformData: function(value)** � ���� ������, �� �� ������� ����� ������������ �����, ���������� � ���������� ��� ���������, ������� ���������� �������
```js
options: {
    customBodyRender: v => v === null ? "���" : ToDateString(v, true),
    transformData: v => v === null ? "���" : "��",
},
```
- **sort: bool** � ��������� ���������� �� �������, �������� �� ��������� _true_
- **display: bool** � ������������ �������, �������� �� ��������� _true_
## Custom actions and Redux compatability
1. **search (string)** � ������� ����� �� �������
2. **onSearchChanged (function(search: string))** � ���� ������� ������ ������ � search, ������� ��� ������ �������� ����� ������������ searh � ���������� ��������� ��������� ���������� �������� � ������������ ����������
```js
<Table
    search={this.props.search}
    onSearchChanged={(searchVal) => this.props.changeSearch(searchVal)}
/>
```
3. **initialFilters ([Filter](#Filter))** � ������� ������� �� �������
4. **onFilterChanged (function(filters: arrayOf([Filter](#Filter))))** � ���� ������� ������ ������ � initialFilters, ������� ��� ������ �������� ����� ������������ initialFilters ��� ������� ���������� � ���������� ��������� ��������� ���������� �������� � ������������ ����������
```js
<Table
    initialFilters={this.props.filter}
    onFilterChanged={(filter) => this.props.changeFilters(filter)}
/>
```
3. **sort ([Filter](#Filter))** � ������� ���������� �������
4. **onSortingChanged (function(sort: arrayOf([Sort](#Sort))))** � ���� ������� ������ ������ � sort, ������� ��� ���������� �������� ����� ������������ sort ��� ������� ���������� � ���������� ��������� ��������� ���������� �������� � ������������ ����������
```js
<Table
    sort={this.props.sort}
    onSortingChanged={(sorting) => this.props.changeSorting(sorting)}
/>
```
____
## Additional classes
### Table options
- **rowsPerPage: number** � ���������� ����� �� ��������
- **page: number** � ������� ��������
- **search: string** � ��������� ������
- **sort: string** � ��������� ������
- **filters: arrayOf(Filter)** � ������� ����������
- **columns: arrayOf(string)** � ������� ������������ �������
- **headRows: arrayOf(string)** � ������� ������������ ������ ���������
### File
- **name** � ������������
- **file** � �������� ������
### Filter
- **name: string** � ������������ �������
- **value: arrayOf(string)** � �������� �������
```js
{
    column: "status",
    value: ["� ������", "�����"]
}
```
### Sort
- **column: string** � ������������ �������
- **dir: "asc" || "desc"** � ����������� ����������
```js
{
    column: "date",
    dir: "desc"
}
```