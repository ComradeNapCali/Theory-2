import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildWeatherUrl, fetchWeather, getWeatherLocation } from "./weather";

describe("buildWeatherUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, OPENWEATHER_API_KEY: "test-api-key" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("builds a URL with the city and API key", () => {
    const url = buildWeatherUrl("Edmonton");
    expect(url).toContain("https://api.openweathermap.org/data/2.5/weather");
    expect(url).toContain("q=Edmonton");
    expect(url).toContain("appid=test-api-key");
    expect(url).toContain("units=metric");
  });

  it("encodes city names with spaces", () => {
    const url = buildWeatherUrl("New York");
    expect(url).toContain("q=New%20York");
  });

  it("throws when API key is not set", () => {
    process.env.OPENWEATHER_API_KEY = "";
    expect(() => buildWeatherUrl("Edmonton")).toThrow("OPENWEATHER_API_KEY is not set");
  });

  it("throws when city is empty", () => {
    expect(() => buildWeatherUrl("")).toThrow("City is required");
  });

  it("throws when city is not provided", () => {
    expect(() => buildWeatherUrl()).toThrow("City is required");
  });
});

describe("fetchWeather", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.OPENWEATHER_API_KEY = "test-api-key";
    global.fetch = vi.fn();
  });

  afterAll(() => {
    process.env = { ...process.env };
  });

  it("returns parsed JSON on successful response", async () => {
    const mockData = { weather: [{ main: "Clear" }], main: { temp: 20 } };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchWeather("Edmonton");
    expect(result).toEqual(mockData);
  });

  it("throws on non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchWeather("InvalidCity")).rejects.toThrow("Weather API request failed: 404 Not Found");
  });
});

describe("getWeatherLocation", () => {
  it("returns weather.location when present", () => {
    const profile = { weather: { location: "Toronto" } };
    expect(getWeatherLocation(profile)).toBe("Toronto");
  });

  it("extracts city from timeZone.zone when no weather.location", () => {
    const profile = { timeZone: { zone: "America/Edmonton" } };
    expect(getWeatherLocation(profile)).toBe("Edmonton");
  });

  it("replaces underscores with spaces from timeZone.zone", () => {
    const profile = { timeZone: { zone: "America/Los_Angeles" } };
    expect(getWeatherLocation(profile)).toBe("Los Angeles");
  });

  it("falls back to contacts.location", () => {
    const profile = { contacts: { location: "Italy" } };
    expect(getWeatherLocation(profile)).toBe("Italy");
  });

  it("throws when no location is available", () => {
    expect(() => getWeatherLocation({})).toThrow("No weather location found in profile");
  });

  it("prioritizes weather.location over timeZone.zone", () => {
    const profile = {
      weather: { location: "Toronto" },
      timeZone: { zone: "America/Edmonton" },
    };
    expect(getWeatherLocation(profile)).toBe("Toronto");
  });
});
