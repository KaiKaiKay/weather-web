export interface WeatherApiResponse {
  success: string;
  result: {
    resource_id: string;
    fields: Array<{ id: string; type: string }>;
  };
  records: {
    datasetDescription: string;
    location: WeatherLocation[];
  };
}

export interface WeatherLocation {
  locationName: string;
  weatherElement: WeatherElement[];
}

export interface WeatherElement {
  elementName: string;
  time: WeatherTime[];
}

export interface WeatherTime {
  startTime: string;
  endTime: string;
  parameter: {
    parameterName: string;
    parameterUnit: string;
  };
}


export interface TimeHeader {
  start: string;
  end: string;
  label: string;
}
export interface TimeCell {
  kind: 'number' | 'text';
  value: string;
  unit?: string;
}
export interface WeatherRowData {
  id: string;
  locationName: string;
  times: TimeCell[];
  selected: boolean;
  elementName: string;
  elementNameDes?: string;
}
