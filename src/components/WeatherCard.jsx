import Card from "./Card";
import dayjs from "dayjs";

export default function WeatherCard({ weatherData, city }) {
  if (!weatherData) {
    return (
      <Card colSpan="md:col-span-1" rowSpan="md:row-span-1">
        <div className="flex h-full items-center justify-center rounded bg-darkslate-400/30 p-2">
          <p className="text-xs font-light text-neutral-200">Weather unavailable</p>
        </div>
      </Card>
    );
  }

  const {
    weather: weatherArr,
    main: { temp, feels_like: feelsLike, humidity },
    wind: { speed: windSpeed },
    sys: { sunrise, sunset },
    name: locationName,
    dt,
  } = weatherData;

  const condition = weatherArr[0];
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;

  const sunriseTime = dayjs.unix(sunrise).format("h:mm A");
  const sunsetTime = dayjs.unix(sunset).format("h:mm A");
  const updatedTime = dayjs.unix(dt).format("h:mm A");

  const displayCity = city || locationName;

  return (
    <Card colSpan="md:col-span-1" rowSpan="md:row-span-1">
      <div className="flex flex-col h-full justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src={iconUrl}
            alt={condition.description}
            className="w-12 h-12"
          />
          <div>
            <p className="text-lg font-bold">{Math.round(temp)}°C</p>
            <p className="text-xs text-neutral-400 capitalize">{condition.description}</p>
          </div>
        </div>
        <div className="text-xs text-neutral-400 space-y-0.5">
          <p>
            Feels like {Math.round(feelsLike)}°C | Humidity: {humidity}%
          </p>
          <p>Wind: {windSpeed} m/s</p>
          <p>
            Sunrise: {sunriseTime} | Sunset: {sunsetTime}
          </p>
          <p>{displayCity}</p>
          <p className="text-neutral-500">Updated: {updatedTime}</p>
        </div>
      </div>
    </Card>
  );
}
