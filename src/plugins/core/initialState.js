import { getColumnProperties } from '../../utils/columnUtils';
import { getRowProperties } from '../../utils/rowUtils';


const styleConfig = {
  icons: {
    TableHeadingCell: {
      sortDescendingIcon: '▼',
      sortAscendingIcon: '▲'
    },
  },
  classNames: {
    Cell: 'griddle-cell',
    Filter: 'griddle-filter',
    Loading: 'griddle-loadingResults',
    NextButton: 'griddle-next-button',
    NoResults: 'griddle-noResults',
    PageDropdown: 'griddle-page-select',
    Pagination: 'griddle-pagination',
    PreviousButton: 'griddle-previous-button',
    Row: 'griddle-row',
    RowDefinition: 'griddle-row-definition',
    Settings: 'griddle-settings',
    SettingsToggle: 'griddle-settings-toggle',
    Table: 'griddle-table',
    TableBody: 'griddle-table-body',
    TableHeading: 'griddle-table-heading',
    TableHeadingCell: 'griddle-table-heading-cell',
    TableHeadingCellAscending: 'griddle-heading-ascending',
    TableHeadingCellDescending: 'griddle-heading-descending',
  },
  styles: {
  }
};

const initialState = (config) => {

  const {
    children:rowPropertiesComponent,
  } = config;

  const rowProperties = getRowProperties(rowPropertiesComponent);
  const columnProperties = getColumnProperties(rowPropertiesComponent);

  const renderProperties = {
    rowProperties,
    columnProperties
  }

  //const pageProperties = {
  //  currentPage: 1,
  //  pageSize: 10,
  //  ...externalPageProperties,
  //}

  const localInitialState = {
    enableSettings: true,
    textProperties: {
      next: 'Next',
      previous: 'Previous',
      settingsToggle: 'Settings'
    }
  }

  return {
    styleConfig,
    renderProperties,
    initialState: localInitialState
  };
}

export default initialState;
