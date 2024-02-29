import { ReportHandler, Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric: Metric) => onPerfEntry(metric));
      getFID((metric: Metric) => onPerfEntry(metric));
      getFCP((metric: Metric) => onPerfEntry(metric));
      getLCP((metric: Metric) => onPerfEntry(metric));
      getTTFB((metric: Metric) => onPerfEntry(metric));
    });
  }
};

export default reportWebVitals;
