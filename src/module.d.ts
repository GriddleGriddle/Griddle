import * as React from 'react';

interface PropertyBag<T> {
    [propName: string]: T;
}

type GriddleComponent<T> = (props: T) => string | JSX.Element | React.ComponentClass<T> | React.StatelessComponent<T>

export namespace components {

export interface RowDefinitionProps {
    //The column value that should be used as the key for the row
    //if this is not set it will make one up (not efficient)
    rowKey?: string;

    //The column that will be known used to track child data
    //By default this will be "children"
    childColumnName?: string;

    //The css class name, or a function to generate a class name from props, to apply to this row.
    cssClassName?: string | ((props: any) => string);

    // Allow custom plugin props
    [x: string]: any,
}

export class RowDefinition extends React.Component<RowDefinitionProps, any> {
}

export interface ColumnDefinitionProps {
    //The name of the column that this definition applies to.
    id: string,

    //The order that this column appears in. If not specified will just use the order that they are defined
    order?: number,

    // TODO: Unused?
    //Determines whether or not the user can disable this column from the settings.
    locked?: boolean,

    //The css class name, or a function to generate a class name from props, to apply to the header for the column.
    headerCssClassName?: string | ((props: any) => string);

    //The css class name, or a function to generate a class name from props, to apply to this column.
    cssClassName?: string | ((props: any) => string);

    //The display name for the column. This is used when the name in the column heading and settings should be different from the data passed in to the Griddle component.
    title?: string,

    //The component that should be rendered instead of the standard column data. This component will still be rendered inside of a TD element.
    customComponent?: GriddleComponent<CellProps>,

    //The component that should be used instead of the normal title
    customHeadingComponent?: GriddleComponent<TableHeadingCellProps>,

    //Can this column be sorted
    sortable?: boolean,

    // TODO: Unused?
    //What sort type this column uses - magic string :shame:
    sortType?: string,

    // TODO: Unused?
    //Any extra data that should be passed to each instance of this column
    extraData?: any,

    //The width of this column -- this is string so things like % can be specified
    width?: number|string,

    // TODO: Unused?
    //The number of cells this column should extend. Default is 1.
    colSpan?: number,

    // Is this column visible
    visible?: boolean,

    // Is this column metadta
    isMetadata?: boolean,

    // Allow custom plugin props
    [x: string]: any,
}

export class ColumnDefinition extends React.Component<ColumnDefinitionProps, any> {
}

export interface CellProps {
    value?: any;
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    className?: string;
    style?: React.CSSProperties;
}

class Cell extends React.Component<CellProps, any> {
}

export interface RowProps {
    Cell?: any;
    griddleKey?: string;
    columnIds?: number[];
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    className?: string;
    style?: React.CSSProperties;
}

class Row extends React.Component<RowProps, any> {
}

export interface TableProps {
    visibleRows?: number,
    TableHeading?: any,
    TableBody?: any,
    NoResults?: any,
}

class Table extends React.Component<TableProps, any> {
}

export interface TableBodyProps {
    rowIds?: number[];
    Row?: any;
    style?: React.CSSProperties;
    className?: string;
}

class TableBody extends React.Component<TableBodyProps, any> {
}

export interface TableHeadingProps {
    columnIds?: number[];
    columnTitles?: string[];
    TableHeadingCell: any;
}

class TableHeading extends React.Component<TableHeadingProps, any> {
}

export interface TableHeadingCellProps {
    title?: string;
    columnId?: number;
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    icon?: any;
    className?: string;
    style?: React.CSSProperties;
}

class TableHeadingCell extends React.Component<TableHeadingCellProps, any> {
}

const TableContainer: (OriginalComponent: any) => any;

export interface SettingsWrapperProps {
    SettingsToggle?: GriddleComponent<SettingsToggleProps>;
    Settings?: GriddleComponent<SettingsProps>;
    isEnabled?: boolean;
    isVisible?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

class SettingsWrapper extends React.Component<SettingsWrapperProps, any> {
}

const SettingsWrapperContainer: (OriginalComponent: any) => any;

export interface SettingsToggleProps {
    onClick?: Function;
    text?: any;
    className?: string;
    style?: React.CSSProperties;
}

class SettingsToggle extends React.Component<SettingsToggleProps, any> {
}

const SettingsToggleContainer: (OriginalComponent: any) => any;

export interface SettingsProps {
    settingsComponents?: GriddleComponent<any>[];
    className?: string;
    style?: React.CSSProperties;
}

class Settings extends React.Component<SettingsProps, any> {
}

const SettingsContainer: (OriginalComponent: any) => any;

const SettingsComponents: PropertyBag<GriddleComponent<any>>;

} // namespace components

export interface GriddleComponents {
    Cell?: any;
    CellContainer?: any;
    ColumnDefinition?: any;
    Row?: any;
    RowContainer?: any;
    RowDefinition?: any;
    Table?: any;
    TableBody?: any;
    TableBodyContainer?: any;
    TableHeading?: any;
    TableHeadingContainer?: any;
    TableHeadingCell?: any;
    TableHeadingCellContainer?: any;
    TableHeadingCellEnhancer?: any;
    TableContainer?: any;
    Layout?: any;
    LayoutContainer?: any;
    NextButton?: any;
    NextButtonEnhancer?: any;
    NextButtonContainer?: any;
    NoResults?: any;
    NoResultsContainer?: any;
    PageDropdown?: any;
    PageDropdownContainer?: any;
    Pagination?: any;
    PaginationContainer?: any;
    PreviousButton?: any;
    PreviousButtonEnhancer?: any;
    PreviousButtonContainer?: any;
    Filter?: any;
    FilterEnhancer?: any;
    FilterContainer?: any;
    GriddleConnect?: any;
    SettingsToggle?: any;
    SettingsToggleContainer?: any;
    SettingsWrapper?: any;
    SettingsWrapperContainer?: any;
    Settings?: any;
    SettingsContainer?: any;
    SettingsComponents?: PropertyBag<GriddleComponent<any>>;
}

export interface GriddleEvents {
    onFilter?: (filterText: string) => void;
    onSort?: (sortProperties: any) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onGetPage?: (pageNumber: number) => void;
}

export interface GriddleSortKey {
    id: string;
    sortAscending: boolean;
}

export interface GriddleStyleElements<T> {
    Cell?: T;
    Filter?: T;
    Loading?: T;
    NextButton?: T;
    NoResults?: T;
    PageDropdown?: T;
    Pagination?: T;
    PreviousButton?: T;
    Row?: T;
    RowDefinition?: T;
    Settings?: T;
    SettingsToggle?: T;
    Table?: T;
    TableBody?: T;
    TableHeading?: T;
    TableHeadingCell?: T;
    TableHeadingCellAscending?: T;
    TableHeadingCellDescending?: T;
}

export interface GriddleStyleIcons {
    sortAscendingIcon?: any;
    sortDescendingIcon?: any;
}

export interface GriddleStyleConfig {
    classNames?: GriddleStyleElements<string>;
    icons?: GriddleStyleElements<GriddleStyleIcons>;
    styles?: GriddleStyleElements<React.CSSProperties>;
}

export interface GriddlePageProperties {
    currentPage?: number;
    pageSize?: number;
    recordCount?: number;
}

interface RowRenderProperties {
    rowKey?: string;
    childColumnName?: string;
    cssClassName?: string | ((props: any) => string);
    props?: {
        children: components.ColumnDefinition[];
    };
}

interface ColumnRenderProperties {
    id: string;
    title?: string;
    isMetadata?: boolean;
    order?: number;
    sortMethod?: (data: any[], column: string, sortAscending?: boolean) => number;
    visible?: boolean;
    customComponent?: GriddleComponent<any>;
    customHeadingComponent?: GriddleComponent<any>;
}

export interface GriddleRenderProperties {
    rowProperties?: RowRenderProperties;
    columnProperties?: PropertyBag<ColumnRenderProperties>;
}

type Reducer = (state: any, action?: any) => void;
type Selector = (state: any, props?: any) => any;

interface SettingsComponentObject {
    order: number;
    component?: GriddleComponent<any>;
}

export interface GriddlePlugin {
    components?: GriddleComponents,
    renderProperties?: GriddleRenderProperties;
    initialState?: PropertyBag<any>,
    reducer?: PropertyBag<Reducer>,
    selectors?: PropertyBag<Selector>,
    settingsComponentObjects?: PropertyBag<SettingsComponentObject>,
}

export interface GriddleProps<T> {
    plugins?: GriddlePlugin[];
    data?: T[];
    events?: GriddleEvents;
    sortProperties?: GriddleSortKey[];
    styleConfig?: GriddleStyleConfig;
    pageProperties?: GriddlePageProperties;
    components?: GriddleComponents;
    renderProperties?: GriddleRenderProperties;
    settingsComponentObjects?: PropertyBag<SettingsComponentObject>;
    storeName?: string;
}

declare class Griddle<T> extends React.Component<GriddleProps<T>, any> {
}

export const actions: PropertyBag<Function>;

export const constants: PropertyBag<string>;

export const selectors: PropertyBag<Selector>;

export const settingsComponentObjects: PropertyBag<SettingsComponentObject>;

export namespace utils {
    const columnUtils: PropertyBag<Function>;
    const compositionUtils: PropertyBag<Function>;
    const dataUtils: PropertyBag<Function>;
    const rowUtils: PropertyBag<Function>;

    interface SortProperties{
      setSortColumn(sortProperties: ((key : GriddleSortKey) => void)) : void;
      sortProperty: GriddleSortKey;
      columnId: string;
    }

    namespace sortUtils {
      function defaultSort(data: any[], column: string, sortAscending?: boolean) : number;
      function setSortProperties(sortProperties: SortProperties) : () => void;
    }
}

export namespace plugins {
    var LocalPlugin : GriddlePlugin;

    interface PositionSettings {
        // The height of the table
        tableHeight?: number|string;

        // The width of the table
        tableWidth?: number|string;

        // The minimum row height
        rowHeight?: number|string;

        // TODO: Unused?
        // The minimum column width
        defaultColumnWidth?: number|string;

        // TODO: Unused?
        // Whether or not the header should be fixed
        fixedHeader?: boolean;

        // TODO: Unused?
        // Disable pointer events while scrolling to improve performance
        disablePointerEvents?: boolean;
    }
    var PositionPlugin : (settings: PositionSettings) => GriddlePlugin;
}

export const ColumnDefinition : typeof components.ColumnDefinition;
export const RowDefinition : typeof components.RowDefinition;

export default Griddle;
