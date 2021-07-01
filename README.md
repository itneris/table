# ItNeris Table
Custom ItNeris company grid based on MaterialUI
____
## Content
1. [Common props](#Common-props)
2. [Client-side](#Client-side)
   - [Example](#Example-client)
3. [Server-side](#Server-side)
   - [Example](#Example-server)
4. [Column properties](#Column-properties)
5. [Custom actions and Redux compatability](#Custom-actions-and-Redux-compatability)
6. [Additional classes](#Additional-classes)
____
## Common props
1. **onDownload: function([options](#Table-options))** — действие по нажатию на иконку скачивания
2. **sort: arrayOf([Sort](#Sort))** — начальная сортировка таблицы
4. **title: string** — если задано, то будет выведен заголовок страницы с иконкой поиска, в противном случае поиск будет доступен всегда
5. **mimeType: string** — mime-type для файла выгрузки таблицы, по умолчанию _text/csv_
6. **showColNums: bool** — отображение номеров колонок таблицы, по умочанию _false_
7. **disablePaging: bool** — скрывает пагинатор таблицы, по умочанию _false_
8.  **showRowNums: bool** — отображение номеров строк таблицы, по умочанию _false_
9.  **multiFilter: bool** — позволяет выбирать множества значений в фильтрах таблицы, по умочанию _false_
10. **disableSearch: bool** — отключает возможность поиска по таблице, по умочанию _false_
11. **disableSortProps: bool** — позволяет выполнять внутреннюю сортировку таблицы с включенным **onSortingChanged** для написания только связанных эффектов сортировки, по умочанию _false_
```js
<Table
    data={this.state.tableData}
    sort={this.state.gridSort} //Выбранная из БД сортировка для текущего пользователя
    disableSortProps={true} //Оставляем внутреннюю логику сортировки таблицы
    onSortingChanged={async (sort) => {
        //Заносим в БД изменение сортировки
        await HttpUtil.fetchAsync("/api/Users/ChangeEclSort", { sort: JSON.stringify(sort) }, "POST");
    }}
/>
```
12. **overflow: bool** — позволяет таблице растягиваться за границы экрана по оси X со скроллбаром, по умочанию _false_
13. **rowCount: number** — количество строк на странице, по умолчанию _25_
13. **columns: arrayOf([Column](#Column-properties))** — массив колонок таблицы
13. **disableToken: bool** — отключить передачу accessToken на сервер, по умолчанию false
## Client-side
1. **data: array** — данные таблицы, массив вида
```js
 [
    { id: 1, name: 'name 1', date: '2021-03-02T12:00:00' },
    { id: 2, name: 'name 2', date: '2021-03-03T15:00:00' },
 ]
```
2. **downloadName: string** — наименование файла выгрузки таблицы
3. **filterList: arrayOf([Filter](#Filter))** - массив доступных фильтров для таблицы
### Example client
```js
<Table
    data={this.state.rows}
    filterList={[
        { column: "status", value: ["Блокировано", "Активно"] },
    ]}
    filters={[{ column: "status", value: ["Активно"] }]}
    onRowClick={(n) => this.props.history.push(`/entity/edit/` + n.id)}
    sort={[{ column: "name", dir: "desc" }]}
    columns={columns}
    onDownloadUrl={"api/Controller/Download"}
/>
```
____
## Server-side
1. **showLoader: function()** — функция для отображения глобальной загрузки во время запроса к серверу
2. **stopLoader: function()** — функция для скрытия глобальной загрузки во время запроса к серверу
3. **onDownloadUrl: string** — URL для выполнения GET запроса к серверу для получения [файла выгрузки](#File)
4. **downloadWithFilters: bool** — если true, то для получения Blob будет выполнен POST запрос с передачей [опций таблицы](#Table-options) в теле запроса
5. **data: string** — URL для выполнения POST запроса с передачей [опций](#Table-options) в теле запроса, в ответ ожидает массив вида
```js
 [
    { id: 1, name: 'name 1', date: '2021-03-02T12:00:00' },
    { id: 2, name: 'name 2', date: '2021-03-03T15:00:00' },
 ]
```
6. **filterList: string** — URL для выполнения GET запроса к серверу для получения массива доступных [фильтров](#Filter)
### Example server
```js
<Table
    showLoader={this.props.showLoader}
    stopLoader={this.props.stopLoader}
    data="api/Controller/List"
    onDownloadUrl="api/Controller/Download"
    filterList="api/Controller/GetFilters"
    downloadWithFilters
    columns={columns}
    onRowClick={(n) => this.props.history.push("/entity/edit/" + n.id)}
/>
```
____
## Column properties
1. **name: string** — наименование колонки в массиве data таблицы
2. **label: string** — отображение наименования колонки
3. **options**  — свойства колоки
- **customBodyRender: function(value, row)** — рендер значения колонки, опираясь на её значение и строку в целом
```js
customBodyRender: value => <div style={{ fontWeight: "bold" }}>
        {value}
    </div>
```
- **customHeadRender: function()** — рендер заголовка колонки
```js
customHeadRender: () => <Box display="flex" alignItems="center">
                Статус
                <Tooltip title='Подсказка'><HelpOutline /></Tooltip>
            </Box>
```
- **type: "array"** — если задан, то по колонке будет производится поиск и фильтрация как по массиву
- **filterType: "and" || "or"** — если задан type = array, то определить "И" или "ИЛИ" фильтрация будет производиться по массиву, значение по умолчанию "OR"
- **trasformData: function(value)** — если задано, то по колонке будет производится поиск, сортировка и фильтрация как значениям, которые возвращает функция
```js
options: {
    customBodyRender: v => v === null ? "Нет" : ToDateString(v, true),
    transformData: v => v === null ? "Нет" : "Да",
},
```
- **sort: bool** — включение вортировки по колонке, значение по умолчанию _true_
- **display: bool** — отоборажение колонки, значение по умолчанию _true_
## Custom actions and Redux compatability
1. **search (string)** — текущий поиск по таблице
2. **onSearchChanged (function(search: string))** — если функция задана вместе с search, таблица для поиска значений будет использовать searh и возвращать результат изменения поискового значения в родительский компоненет
```js
<Table
    search={this.props.search}
    onSearchChanged={(searchVal) => this.props.changeSearch(searchVal)}
/>
```
3. **filters (arrayOf([Filter](#Filter)))** — текущие фильтры по таблице
4. **onFilterChanged (function(filters: arrayOf([Filter](#Filter))))** — если функция задана вместе с filters, таблица для поиска значений будет использовать initialFilters для каждого обновления и возвращать результат изменения фильтрации значения в родительский компоненет
```js
<Table
    filters={this.props.filter}
    onFilterChanged={(filter) => this.props.changeFilters(filter)}
/>
```
3. **sort (arrayOf([Sort](#Sort)))** — текущая сортировка таблицы
4. **onSortingChanged (function(sort: arrayOf([Sort](#Sort))))** — если функция задана вместе с sort, таблица для сортировки значений будет использовать sort для каждого обновления и возвращать результат изменения сортировки значения в родительский компоненет
```js
<Table
    sort={this.props.sort}
    onSortingChanged={(sorting) => this.props.changeSorting(sorting)}
/>
```
____
## Additional classes
### Table options
- **rowsPerPage: number** — количество строк на странице
- **page: number** — текущая страница
- **search: string** — поисковый запрос
- **sort: arrayOf(Sort)** — фильтрация
- **filters: arrayOf(Filter)** — текущая фильтрация
- **columns: arrayOf(string)** — текущие отображаемые колонки
- **headRows: arrayOf(string)** — текущие отображаемые строки заголовка
### File
- **name** — наименование
- **file** — бинарные данные
### Filter
- **name: string** — наименование колонки
- **value: arrayOf(string)** — значения фильтра
```js
{
    column: "status",
    value: ["В работе", "Новый"]
}
```
### Sort
- **column: string** — наименование колонки
- **dir: "asc" || "desc"** — направление сортировки
```js
{
    column: "date",
    dir: "desc"
}
```