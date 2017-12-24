import * as React from 'react';
import { connect as originalConnect } from 'react-redux';
import { ActionCreator, Middleware } from 'redux';

interface PropertyBag<T> {
    [propName: string]: T;
}

type GriddleComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

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
    customComponent?: GriddleComponent<CellProps & any>,

    //The component that should be used instead of the normal title
    customHeadingComponent?: GriddleComponent<TableHeadingCellProps & any>,

    //Can this column be filtered
    filterable?: boolean,

    //Can this column be sorted
    sortable?: boolean,

    //What sort method this column uses
    sortMethod?: (data: any[], column: string, sortAscending?: boolean) => number;

    // TODO: Unused?
    //What sort type this column uses - magic string :shame:
    sortType?: string,

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
    griddleKey?: number;
    columnId?: string;
    value?: any;
    onClick?: React.MouseEventHandler<Element>;
    onMouseEnter?: React.MouseEventHandler<Element>;
    onMouseLeave?: React.MouseEventHandler<Element>;
    className?: string;
    style?: React.CSSProperties;
}

class Cell extends React.Component<CellProps, any> {
}

export interface RowProps {
    Cell?: any;
    griddleKey?: string;
    columnIds?: number[];
    onClick?: React.MouseEventHandler<Element>;
    onMouseEnter?: React.MouseEventHandler<Element>;
    onMouseLeave?: React.MouseEventHandler<Element>;
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
    onClick?: React.MouseEventHandler<Element>;
    onMouseEnter?: React.MouseEventHandler<Element>;
    onMouseLeave?: React.MouseEventHandler<Element>;
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
    onClick?: React.MouseEventHandler<Element>;
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
    Layout?: GriddleComponent<any>;
    LayoutEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    LayoutContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    LayoutContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    Style?: GriddleComponent<any>;
    StyleEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    StyleContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    StyleContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    Filter?: GriddleComponent<any>;
    FilterEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    FilterContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    FilterContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    SettingsWrapper?: GriddleComponent<components.SettingsWrapperProps>;
    SettingsWrapperEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsWrapperProps>) => GriddleComponent<components.SettingsWrapperProps>;
    SettingsWrapperContainer?: (OriginalComponent: GriddleComponent<components.SettingsWrapperProps>) => GriddleComponent<components.SettingsWrapperProps>;
    SettingsWrapperContainerEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsWrapperProps>) => GriddleComponent<components.SettingsWrapperProps>;

    SettingsToggle?: GriddleComponent<components.SettingsToggleProps>;
    SettingsToggleEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsToggleProps>) => GriddleComponent<components.SettingsToggleProps>;
    SettingsToggleContainer?: (OriginalComponent: GriddleComponent<components.SettingsToggleProps>) => GriddleComponent<components.SettingsToggleProps>;
    SettingsToggleContainerEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsToggleProps>) => GriddleComponent<components.SettingsToggleProps>;

    Settings?: GriddleComponent<components.SettingsProps>;
    SettingsEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsProps>) => GriddleComponent<components.SettingsProps>;
    SettingsContainer?: (OriginalComponent: GriddleComponent<components.SettingsProps>) => GriddleComponent<components.SettingsProps>;
    SettingsContainerEnhancer?: (OriginalComponent: GriddleComponent<components.SettingsProps>) => GriddleComponent<components.SettingsProps>;

    SettingsComponents?: PropertyBag<GriddleComponent<any>>;

    Table?: GriddleComponent<components.TableProps>;
    TableEnhancer?: (OriginalComponent: GriddleComponent<components.TableProps>) => GriddleComponent<components.TableProps>;
    TableContainer?: (OriginalComponent: GriddleComponent<components.TableProps>) => GriddleComponent<components.TableProps>;
    TableContainerEnhancer?: (OriginalComponent: GriddleComponent<components.TableProps>) => GriddleComponent<components.TableProps>;

    TableHeading?: GriddleComponent<components.TableHeadingProps>;
    TableHeadingEnhancer?: (OriginalComponent: GriddleComponent<components.TableHeadingProps>) => GriddleComponent<components.TableHeadingProps>;
    TableHeadingContainer?: (OriginalComponent: GriddleComponent<components.TableHeadingProps>) => GriddleComponent<components.TableHeadingProps>;
    TableHeadingContainerEnhancer?: (OriginalComponent: GriddleComponent<components.TableHeadingProps>) => GriddleComponent<components.TableHeadingProps>;

    TableHeadingCell?: GriddleComponent<components.TableHeadingCellProps>;
    TableHeadingCellEnhancer?: (OriginalComponent: GriddleComponent<components.TableHeadingCellProps>) => GriddleComponent<components.TableHeadingCellProps>;
    TableHeadingCellContainer?: (OriginalComponent: GriddleComponent<components.TableHeadingCellProps>) => GriddleComponent<components.TableHeadingCellProps>;
    TableHeadingCellContainerEnhancer?: (OriginalComponent: GriddleComponent<components.TableHeadingCellProps>) => GriddleComponent<components.TableHeadingCellProps>;

    TableBody?: GriddleComponent<components.TableBodyProps>;
    TableBodyEnhancer?: (OriginalComponent: GriddleComponent<components.TableBodyProps>) => GriddleComponent<components.TableBodyProps>;
    TableBodyContainer?: (OriginalComponent: GriddleComponent<components.TableBodyProps>) => GriddleComponent<components.TableBodyProps>;
    TableBodyContainerEnhancer?: (OriginalComponent: GriddleComponent<components.TableBodyProps>) => GriddleComponent<components.TableBodyProps>;

    Row?: GriddleComponent<components.RowProps>;
    RowEnhancer?: (OriginalComponent: GriddleComponent<components.RowProps>) => GriddleComponent<components.RowProps>;
    RowContainer?: (OriginalComponent: GriddleComponent<components.RowProps>) => GriddleComponent<components.RowProps>;
    RowContainerEnhancer?: (OriginalComponent: GriddleComponent<components.RowProps>) => GriddleComponent<components.RowProps>;

    Cell?: GriddleComponent<components.CellProps>;
    CellEnhancer?: (OriginalComponent: GriddleComponent<components.CellProps>) => GriddleComponent<components.CellProps>;
    CellContainer?: (OriginalComponent: GriddleComponent<components.CellProps>) => GriddleComponent<components.CellProps>;
    CellContainerEnhancer?: (OriginalComponent: GriddleComponent<components.CellProps>) => GriddleComponent<components.CellProps>;

    NoResults?: GriddleComponent<any>;
    NoResultsEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    NoResultsContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    NoResultsContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    Pagination?: GriddleComponent<any>;
    PaginationEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PaginationContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PaginationContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    NextButton?: GriddleComponent<any>;
    NextButtonEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    NextButtonContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    NextButtonContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    PageDropdown?: GriddleComponent<any>;
    PageDropdownEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PageDropdownContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PageDropdownContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;

    PreviousButton?: GriddleComponent<any>;
    PreviousButtonEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PreviousButtonContainer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
    PreviousButtonContainerEnhancer?: (OriginalComponent: GriddleComponent<any>) => GriddleComponent<any>;
}

export interface GriddleActions extends PropertyBag<ActionCreator<any> | undefined> {
    onSort?: (sortProperties: any) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onGetPage?: (pageNumber: number) => void;
    setFilter?: (filterText: string) => void;
}

export interface GriddleEvents extends GriddleActions {
    onFilter?: (filterText: string) => void;
    setSortProperties?: (sortProperties: utils.SortProperties) => () => void;
}

export interface GriddleSortKey {
    id: string;
    sortAscending: boolean;
}

export interface GriddleStyleElements<T> {
    Cell?: T;
    Filter?: T;
    Layout?: T;
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

interface RowRenderProperties extends components.RowDefinitionProps {
}

interface ColumnRenderProperties extends components.ColumnDefinitionProps {
}

export interface GriddleRenderProperties {
    rowProperties?: RowRenderProperties;
    columnProperties?: PropertyBag<ColumnRenderProperties>;
}

type Reducer = (state: any, action?: any) => void;
type Selector = (state: any, props?: any) => any;
type Listener = (prevState: any, nextState: any, otherArgs?: any) => any;

interface SettingsComponentObject {
    order: number;
    component?: GriddleComponent<any>;
}

interface GriddleExtensibility {
    components?: GriddleComponents,
    events?: GriddleEvents;
    reducer?: PropertyBag<Reducer>,
    renderProperties?: GriddleRenderProperties;
    selectors?: PropertyBag<Selector>,
    settingsComponentObjects?: PropertyBag<SettingsComponentObject>,
    styleConfig?: GriddleStyleConfig,
    listeners?: PropertyBag<Listener>,
}

interface GriddleInitialState {
    enableSettings?: boolean;
    pageProperties?: GriddlePageProperties;
    sortMethod?: (data: any[], column: string, sortAscending?: boolean) => number;
    sortProperties?: GriddleSortKey[];
    textProperties?: {
      next?: string,
      previous?: string,
      settingsToggle?: string,
    }

    [x: string]: any;
}

export interface GriddlePlugin extends GriddleExtensibility {
    initialState?: GriddleInitialState;
    reduxMiddleware?: Middleware[];
}

export interface GriddleProps<T> extends GriddlePlugin, GriddleInitialState {
    core?: GriddlePlugin;
    plugins?: GriddlePlugin[];
    data?: T[];
    storeKey?: string;
}

declare class Griddle<T> extends React.Component<GriddleProps<T>, any> {
  static storeKey: string;
}

export const actions: GriddleActions;

export const constants: PropertyBag<string>;

export const selectors: PropertyBag<Selector>;

export const settingsComponentObjects: PropertyBag<SettingsComponentObject>;

export const connect : typeof originalConnect;

export namespace utils {
    const columnUtils: PropertyBag<Function>;
    const compositionUtils: PropertyBag<Function>;
    const dataUtils: PropertyBag<Function>;
    const rowUtils: PropertyBag<Function>;

    const connect : typeof originalConnect;

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
    var CorePlugin : GriddlePlugin;

    var LegacyStylePlugin : GriddlePlugin;

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
