import React from "react";
import { IVisualization } from "../../interfaces";
import SingleValue from "./SingleValue";

type VisualizationProps = {
  visualization: IVisualization;
};

const Visualization = ({ visualization }: VisualizationProps) => {
  const displayProperties = (visualizationType: string | undefined) => {
    const allTypes: any = {
      single: (
        <SingleValue
          visualization={visualization}
          {...visualization.properties}
        />
      ),
    };
    if (visualizationType) {
      return allTypes[visualizationType] || null;
    }
    return <div>Nothing to display</div>;
  };
  return <>{displayProperties(visualization.type)}</>;
};

export default Visualization;
