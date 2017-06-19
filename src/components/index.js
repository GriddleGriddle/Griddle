import Cell from './Cell';
import CellContainer from './CellContainer';
import ColumnDefinition from './ColumnDefinition';
import Row from './Row';
import RowContainer from './RowContainer';
import RowDefinition from './RowDefinition';
import Table from './Table';
import TableBody from './TableBody';
import TableBodyContainer from './TableBodyContainer';
import TableHeading from './TableHeading';
import TableHeadingContainer from './TableHeadingContainer';
import TableHeadingCell from './TableHeadingCell';
import TableHeadingCellContainer from './TableHeadingCellContainer';
import TableHeadingCellEnhancer from './TableHeadingCellEnhancer';
import TableContainer from './TableContainer';
import Layout from './Layout';
import LayoutContainer from './LayoutContainer';
import Pagination from './Pagination';
import PaginationContainer from './PaginationContainer';
import Filter from './Filter';
import FilterEnhancer from './FilterEnhancer';
import FilterContainer from './FilterContainer';
import SettingsToggle from './SettingsToggle';
import SettingsToggleContainer from './SettingsToggleContainer';
import SettingsWrapper from './SettingsWrapper';
import SettingsWrapperContainer from './SettingsWrapperContainer';
import Settings from './Settings';
import SettingsContainer from './SettingsContainer';
import { components as SettingsComponents } from '../settingsComponentObjects';
import NextButton from './NextButton';
import NextButtonEnhancer from './NextButtonEnhancer';
import NextButtonContainer from './NextButtonContainer';
import NoResults from './NoResults';
import NoResultsContainer from './NoResultsContainer';
import PreviousButton from './PreviousButton';
import PreviousButtonEnhancer from './PreviousButtonEnhancer';
import PreviousButtonContainer from './PreviousButtonContainer';
import PageDropdown from './PageDropdown';
import PageDropdownContainer from './PageDropdownContainer';

const components = {
  Cell,
  CellContainer,
  ColumnDefinition,
  Row,
  RowContainer,
  RowDefinition,
  Table,
  TableBody,
  TableBodyContainer,
  TableHeading,
  TableHeadingContainer,
  TableHeadingCell,
  TableHeadingCellContainer,
  TableHeadingCellEnhancer,
  TableContainer,
  Layout,
  LayoutContainer,
  NextButton,
  NextButtonEnhancer,
  NextButtonContainer,
  NoResults,
  NoResultsContainer,
  PageDropdown,
  PageDropdownContainer,
  Pagination,
  PaginationContainer,
  PreviousButton,
  PreviousButtonEnhancer,
  PreviousButtonContainer,
  Filter,
  FilterEnhancer,
  FilterContainer,
  SettingsToggle,
  SettingsToggleContainer,
  SettingsWrapper,
  SettingsWrapperContainer,
  Settings,
  SettingsContainer,
  SettingsComponents,
  Style: () => null,
};

export default components;
