declare const window: any;

interface TrackEventOptions {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const trackEvent = (action: string, options: TrackEventOptions = {}) => {
  if (window.gtag && process.env.REACT_APP_ENV === "production") {
    window.gtag('event', action, options);
  }
};