# ItNeris Table
Custom ItNeris company grid based on MaterialUI
____
## Content
1. [Common props](#Common-props)
2. [Methods](#Methods)
3. [Client-side](#Client-side)
   - [Example](#Example-client)
4. [Server-side](#Server-side)
   - [Example](#Example-server)
5. [Column properties](#Column-properties)
6. [Custom actions and Redux compatability](#Custom-actions-and-Redux-compatability)
7. [Additional classes](#Additional-classes)
____
## Common props
1. **onDownload: function([options](#Table-options)) || string** — действие по нажатию на иконку скачивания, если функция, или URL для выполнения GET запроса к серверу для получения [файла выгрузки](#File) в случае строки
2. **sort: arrayOf([Sort](#Sort))** — начальная сортировка таблицы
3. **filters: arrayOf([Filter](#Filter))** — начальная фильтрация таблицы
4. **title: string** — если задано, то будет выведен заголовок страницы с иконкой поиска, в противном случае поиск будет доступен всегда
5. **mimeType: string** — mime-type для файла выгрузки таблицы, по умолчанию _text/csv_
6. **showColNums: bool** — отображение номеров колонок таблицы, по умочанию _false_
7. **disablePaging: bool** — скрывает пагинатор таблицы, по умочанию _false_
8.  **showRowNums: bool** — отображение номеров строк таблицы, по умочанию _false_
9.  **multiFilter: bool** — позволяет выбирать множества значений в фильтрах таблицы, по умочанию _false_
10. **disableSearch: bool** — отключает возможность поиска по таблице, по умочанию _false_
11. **disableSortProps: bool** — позволяет выполнять внутреннюю сортировку таблицы с включенным **onSortingChanged** для написания только связанных эффектов сортировки, по умочанию _false_
12. **context: arrayOf([Context option](#Context-option))** — опции контекстного меню
13. **stripedRows: bool** — подкрашивать четные строки, по умочанию _false_
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
15. **overflow: bool** — позволяет таблице растягиваться за границы экрана по оси X со скроллбаром, по умочанию _false_
15. **rowCount: number** — количество строк на странице, по умолчанию _25_
16. **columns: arrayOf([Column](#Column-properties))** — массив колонок таблицы
17. **stickyHeader: bool** — если true, то шапка таблицы при вертикальной прокрутке будет оставаться на месте, по умолчанию _false_
18. **small: bool** — paddingTop и paddingBottom у строк становятся меньше, по умолчанию _false_
19. **stripedRows: bool** — чередует цвет строк таблицы, по умолчанию _false_
20. **maxHeight: number** — свойство maxHeight таблицы будет расчитываться по формуле: 100vh - {значение}px, по умолчанию _null_
21. **minWidth: number** — задает минимальную ширину таблицы в пикселях,по умолчанию _null_
22. **sections: object** — массив секций в котором задаются параметры отображения секций
```js
 {
    1: { expanded: true },
    2: { expanded: true },
    3: { expanded: true },
    4: { expanded: true }
 }
```
23. **disableToken: bool** — отключить передачу accessToken на сервер, по умолчанию false
24. **searchProps: object:TextFieldProps** — объект свойств Texfield
25. **customToolbar: React.Element** — дополнительная строка с действиями грида, которая отобразится справа перед фильтрами
26. **tooltipElement: React.Element** — элемент, используемый в качестве тултипа для элементов управления
27. **searchTooltip: string** — текст тултипа для поиска, по умолчанию "Поиск"
28. **filterTooltip: string** — текст тултипа для фильтрации, по умолчанию "Фильтрация"
29. **resetSearchTooltip: string** — текст тултипа для сброса поиска, по умолчанию "Сбросить поиск"
30. **downloadTooltip: string** — текст тултипа для экспорта таблицы, по умолчанию "Экспорт"
31. **viewColumnTooltip: string** — текст тултипа для скрытия секций, по умолчанию "Отображение секций"
## Methods
1. **fetch()** — вызывает запрос на сервер для обновления данных
2. **getData()** — возвращает список текущих строк
3. **transformData(rows)** — заменяет список текущих строк
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
3. **downloadWithFilters: bool** — если true, то для получения Blob будет выполнен POST запрос с передачей [опций таблицы](#Table-options) в теле запроса
4. **data: string** — URL для выполнения POST запроса с передачей [опций](#Table-options) в теле запроса, в ответ ожидает массив вида
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
- **section: number** — номер секции к которой будет привязан столбец, значение по умолчанию _null_
- **sectionFilterLabel: string** — наименование секции, которое будет отображаться в фильтре секций (указывается только один раз в любом столбце каждой секции), значение по умолчанию _null_
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
4. **onFilterChanged (function(filters: arrayOf([Filter](#Filter))))** — если функция задана вместе с filters, таблица для поиска значений будет использовать filters для каждого обновления и возвращать результат изменения фильтрации значения в родительский компоненет
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
- **inToolbar: bool** — отобразить фильтр в тулбаре, по умолчанию _false_
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

### Context option
- **name: string** — наименование пункта меню
- **action: function(id, row)** — действие по нажатию
- **hidden: bool** — скрывать пункт для строки
- **options: arrayOf([Context option](#Context-option))** — вложенное суб-меню 
```js
[
    {
        name: "Show row Id ",
        action: (id, row) => alert(id),
        hidden: row => row.id % 2 === 0,
    },
    {
        name: "Show inner menu",
        options: [
            {
                name: "Show row column 'name'",
                action: (id, row) => alert(row[name])
            }
        ]
    }
]
```
