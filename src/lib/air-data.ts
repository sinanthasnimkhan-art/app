export type AqiCategory =
  | "Good"
  | "Moderate"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

export const CURRENT_PM25 = 42.8;
export const PREDICTED_PM25 = 84.5;
export const CONFIDENCE = 93.6;
export const CURRENT_AQI = 118;

export function categoryForPm25(pm25: number): AqiCategory {
  if (pm25 <= 30) return "Good";
  if (pm25 <= 60) return "Moderate";
  if (pm25 <= 90) return "Unhealthy";
  if (pm25 <= 120) return "Very Unhealthy";
  return "Hazardous";
}

export function aqiFromPm25(pm25: number): number {
  return Math.round(pm25 * 1.42 + 18);
}

export const categoryStyles: Record<
  AqiCategory,
  { dot: string; text: string; bg: string; ring: string; emoji: string; advice: string }
> = {
  Good: {
    dot: "bg-aqi-good",
    text: "text-aqi-good",
    bg: "bg-aqi-good/12",
    ring: "ring-aqi-good/30",
    emoji: "🟢",
    advice: "Air is clean — enjoy outdoor activity.",
  },
  Moderate: {
    dot: "bg-aqi-moderate",
    text: "text-aqi-moderate",
    bg: "bg-aqi-moderate/14",
    ring: "ring-aqi-moderate/30",
    emoji: "🟡",
    advice: "Sensitive groups should limit long outdoor exertion.",
  },
  Unhealthy: {
    dot: "bg-aqi-unhealthy",
    text: "text-aqi-unhealthy",
    bg: "bg-aqi-unhealthy/14",
    ring: "ring-aqi-unhealthy/30",
    emoji: "🟠",
    advice: "Wear a mask outdoors and avoid outdoor exercise.",
  },
  "Very Unhealthy": {
    dot: "bg-aqi-very-unhealthy",
    text: "text-aqi-very-unhealthy",
    bg: "bg-aqi-very-unhealthy/14",
    ring: "ring-aqi-very-unhealthy/30",
    emoji: "🔴",
    advice: "Stay indoors, close windows and run an air purifier.",
  },
  Hazardous: {
    dot: "bg-aqi-hazardous",
    text: "text-aqi-hazardous",
    bg: "bg-aqi-hazardous/14",
    ring: "ring-aqi-hazardous/30",
    emoji: "🟣",
    advice: "Health emergency — remain indoors with filtered air.",
  },
};

function wave(i: number, base: number, amp: number, phase = 0) {
  return Number((base + Math.sin((i + phase) / 3.1) * amp + Math.cos(i / 1.7) * (amp / 3)).toFixed(1));
}

export const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
  const pm25 = wave(i, 62, 24, 2);
  return {
    label: `${String(i).padStart(2, "0")}:00`,
    pm25,
    aqi: aqiFromPm25(pm25),
    predicted: Number((pm25 + 6 + Math.sin(i / 2) * 5).toFixed(1)),
    actual: i < 14 ? Number((pm25 - 3 + Math.cos(i / 2.2) * 4).toFixed(1)) : null,
  };
});

export const dailyForecast = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
].map((label, i) => {
  const pm25 = wave(i, 68, 20, 1);
  return { label, pm25, aqi: aqiFromPm25(pm25), humidity: 54 + i * 3, temperature: 29 + (i % 4) };
});

export const weeklyForecast = Array.from({ length: 8 }, (_, i) => {
  const pm25 = wave(i, 72, 18);
  return { label: `W${i + 1}`, pm25, aqi: aqiFromPm25(pm25) };
});

export const monthlyTrend = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((label, i) => {
  const pm25 = wave(i, 78, 32, 4);
  return { label, pm25, aqi: aqiFromPm25(pm25), rainfall: Math.max(0, 120 - Math.abs(i - 7) * 22) };
});

export const categoryDistribution = [
  { name: "Good", value: 18 },
  { name: "Moderate", value: 37 },
  { name: "Unhealthy", value: 26 },
  { name: "Very Unhealthy", value: 13 },
  { name: "Hazardous", value: 6 },
];

export const stations = [
  { id: "st-1", name: "Central Business District", pm25: 88.2, x: 46, y: 38, users: "Live" },
  { id: "st-2", name: "Riverside Park", pm25: 26.4, x: 22, y: 62, users: "Live" },
  { id: "st-3", name: "Industrial Belt East", pm25: 132.7, x: 74, y: 30, users: "Live" },
  { id: "st-4", name: "Airport Road", pm25: 71.5, x: 66, y: 72, users: "Live" },
  { id: "st-5", name: "University Campus", pm25: 44.9, x: 34, y: 22, users: "Live" },
  { id: "st-6", name: "Harbour Terminal", pm25: 104.1, x: 84, y: 58, users: "Delayed" },
];

export const predictionHistory = [
  { id: "PR-2041", date: "2026-09-24", time: "08:15", location: "Central Business District", current: 42.8, predicted: 84.5, confidence: 93.6 },
  { id: "PR-2040", date: "2026-09-23", time: "19:40", location: "Riverside Park", current: 25.1, predicted: 31.2, confidence: 95.1 },
  { id: "PR-2039", date: "2026-09-23", time: "09:05", location: "Industrial Belt East", current: 118.4, predicted: 141.8, confidence: 90.2 },
  { id: "PR-2038", date: "2026-09-22", time: "17:22", location: "Airport Road", current: 64.9, predicted: 72.4, confidence: 92.7 },
  { id: "PR-2037", date: "2026-09-22", time: "06:48", location: "University Campus", current: 38.2, predicted: 46.3, confidence: 94.4 },
  { id: "PR-2036", date: "2026-09-21", time: "21:10", location: "Harbour Terminal", current: 97.6, predicted: 112.9, confidence: 89.8 },
];

export const models = [
  { name: "Random Forest", accuracy: 91.4, rmse: 8.2, mae: 5.9, progress: 100 },
  { name: "LSTM", accuracy: 94.8, rmse: 6.1, mae: 4.3, progress: 100 },
  { name: "XGBoost", accuracy: 93.2, rmse: 6.9, mae: 4.8, progress: 82 },
];

export const pipelineSteps = [
  { title: "Data Collection", detail: "Pulling 5 years of station + weather records" },
  { title: "Data Cleaning", detail: "Removing outliers, imputing missing sensor gaps" },
  { title: "Feature Engineering", detail: "Lag windows, traffic and industrial indices" },
  { title: "Model Training", detail: "Random Forest · LSTM · XGBoost ensemble" },
  { title: "Prediction", detail: "Forecasting PM2.5 for the next 24 hours" },
  { title: "AQI Interpretation", detail: "Mapping concentration to AQI category" },
  { title: "Early Warning Generation", detail: "Dispatching health advisories" },
];

export const environmentalInputs = [
  { key: "pm25", label: "PM2.5 (µg/m³)", value: "42.8" },
  { key: "temperature", label: "Temperature (°C)", value: "31.4" },
  { key: "humidity", label: "Humidity (%)", value: "68" },
  { key: "wind", label: "Wind Speed (km/h)", value: "9.2" },
  { key: "rainfall", label: "Rainfall (mm)", value: "0.0" },
  { key: "pressure", label: "Pressure (hPa)", value: "1008" },
  { key: "traffic", label: "Traffic Density (%)", value: "76" },
  { key: "industrial", label: "Industrial Activity (%)", value: "64" },
];
