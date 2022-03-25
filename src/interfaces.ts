import { Layout } from "react-grid-layout";

export interface INamed {
  id: string;
  name?: string;
  description?: string;
}
export interface Authentication {
  username: string;
  password: string;
  url: string;
}
export interface IDataSource extends INamed {
  type: "DHIS2" | "ELASTICSEARCH" | "API";
  authentication: Authentication;
  isCurrentDHIS2: boolean;
}

export interface ICategory extends INamed {}
export interface IData {
  dataSource:
    | "DHIS2-SQL-VIEW"
    | "DHIS2-INDICATOR"
    | "DHIS2-DATA-ELEMENT"
    | "DHIS2-PROGRAM-INDICATOR"
    | "OTHER";
}

export interface INumerator extends IData {}
export interface IDenominator extends IData {}

export interface IIndicator extends INamed {
  numerator: INumerator;
  denominator: IDenominator;
  factor: number;
}

export interface IVisualization extends INamed {
  indicator?: IIndicator;
  type: string;
  ignoreFilter?: boolean;
  refreshInterval?: number;
  dataSource?: IDataSource;
}
export interface ISection extends INamed {
  layout: {
    // xxl: Layout;
    // lg: Layout;
    md: Layout;
    // sm: Layout;
    // xs: Layout;
    // xxs: Layout;
  };
  visualizations: IVisualization[];
}

export interface IFilter {}

export interface IDataSource extends INamed {}

export interface IDashboard extends INamed {
  category?: string;
  filters?: string[];
  sections: ISection[];
  isDefault?: boolean;
  published: boolean;
}

export interface IStore {
  categories: string[];
  dashboards: string[];
  dataSources: string[];
  visualizations: string[];
  settings: string[];
  category: string;
  dashboard: IDashboard;
  section: ISection | undefined;
  visualization: IVisualization | undefined;
  organisationUnits: INamed[];
  hasDashboards: boolean;
  hasDefaultDashboard: boolean;
}
