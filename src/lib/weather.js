const API_BASE = "https://api.openweathermap.org/data/2.5";

export function buildWeatherUrl(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is not set");
  }
  if (!city) {
    throw new Error("City is required");
  }
  return `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
}

export async function fetchWeather(city) {
  const url = buildWeatherUrl(city);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function getWeatherLocation(profile) {
  if (profile?.weather?.location) {
    return profile.weather.location;
  }
  if (profile?.timeZone?.zone) {
    const parts = profile.timeZone.zone.split("/");
    return parts[parts.length - 1].replace(/_/g, " ");
  }
  if (profile?.contacts?.location) {
    return profile.contacts.location;
  }
  throw new Error("No weather location found in profile");
}
