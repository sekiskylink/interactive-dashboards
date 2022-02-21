import { domain } from "./Domain";
import {
  Dashboard,
  Category,
  Section,
  Visualization,
  Named,
} from "./interfaces";

export const createDashboard = domain.createEvent<Dashboard>();
export const loadDefaults = domain.createEvent<{
  dashboards: Dashboard[];
  categories: Category[];
  sections: Section[];
  visualizations: Visualization[];
  organisationUnits: Named[];
}>();
