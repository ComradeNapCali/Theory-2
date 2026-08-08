import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherCard from "./WeatherCard";

const mockWeatherData = {
  weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
  main: { temp: 22.5, feels_like: 20.1, humidity: 45 },
  wind: { speed: 3.5 },
  sys: { sunrise: 1700000000, sunset: 1700040000 },
  name: "Edmonton",
  dt: 1700020000,
};

describe("WeatherCard", () => {
  it("renders weather data correctly", () => {
    render(<WeatherCard weatherData={mockWeatherData} />);
    expect(screen.getByText("23°C")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText(/Feels like 20°C/)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 45%/)).toBeInTheDocument();
    expect(screen.getByText(/Wind: 3.5 m\/s/)).toBeInTheDocument();
    expect(screen.getByText("Edmonton")).toBeInTheDocument();
  });

  it("renders fallback when no weather data", () => {
    render(<WeatherCard weatherData={null} />);
    expect(screen.getByText("Weather unavailable")).toBeInTheDocument();
  });

  it("renders weather icon with correct alt text", () => {
    render(<WeatherCard weatherData={mockWeatherData} />);
    const img = screen.getByAltText("clear sky");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://openweathermap.org/img/wn/01d@2x.png");
  });

  it("uses city prop when provided", () => {
    render(<WeatherCard weatherData={mockWeatherData} city="Calgary" />);
    expect(screen.getByText("Calgary")).toBeInTheDocument();
  });
});
