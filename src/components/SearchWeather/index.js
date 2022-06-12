import classnames from "classnames/bind";
import styles from "./SearchWeather.module.scss";
import { useState, useEffectLayout, useEffect } from "react";
const axios = require("axios").default;

const cx = classnames.bind(styles);

function SearchWeather() {
  const [input, setInput] = useState("");
  const [data, setData] = useState({});
  const [filter, setFilter] = useState(false);

  const apiKey = "f56f24967aaf51182d1d4df628297c6d";

  const getWeather = (cityName) => {
    if (!cityName) return;
    if (filter) setFilter(false);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
      )
      .then((res) => {
        setData(res.data);
        setInput("");
        setFilter(false);
      })
      .catch((err) => {
        setInput("");
        setFilter(true);
      });
  };

  const handleSearch = () => {
    getWeather(input);
  };

  const handleRemove = () => {
    setInput("");
  };

  useEffect(() => {
    getWeather("London");
  }, []);

  //Thiết lập thời gian thực theo từng quốc gia
  let dt = new Date();
  let utcTime = dt.getTime() + dt.getTimezoneOffset() * 60000;
  let timeOffset = data.timezone / 3600;
  let country = new Date(utcTime + 3600000 * timeOffset);

  let date = country.getDate();
  let year = country.getFullYear();
  let month = country.toLocaleDateString("default", { month: "long" });
  let day = country.toLocaleDateString("default", { weekday: "long" });

  let time = country.toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let emoji = null;
  if (typeof data.main !== "undefined") {
    switch (data.weather[0].main) {
      case "Clouds":
        emoji = "fa-cloud";
        break;
      case "Thunderstorm":
        emoji = "fa-bolt";
        break;
      case "Drizzle":
        emoji = "fa-cloud-rain";
        break;
      case "Rain":
        emoji = "fa-cloud-shower-heavy";
        break;
      case "Snow":
        emoji = "fa-snow-flake";
        break;
      default:
        emoji = "fa-smog";
        break;
    }
  } else {
    return <div>Loading.....</div>;
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <img
          src={`https://source.unsplash.com/600x900/?${data.weather[0].main}`}
        />

        <div className={cx("layout")}>
          <div className={cx("search")}>
            <input
              type="text"
              placeholder="Enter name city"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input ? (
              <div className={cx("remove")} onClick={() => handleRemove()}>
                <i className={cx("fa-solid fa-xmark")}></i>
              </div>
            ) : (
              ""
            )}
            <div className={cx("icon")} onClick={() => handleSearch()}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>

          <div className={cx("content")}>
            <h2 className={cx("city__name")}>
              {data.name},{data.sys.country}
            </h2>
            <h3 className={cx("today")}>
              {day}, {date} {month}, {year}{" "}
            </h3>
            <h3 className={cx("time")}> {time} </h3>
            <hr />
            <div className={cx("state")}>
              <i className={`fa-solid fa-smog`}></i>
            </div>
            <h1>{(data.main.temp - 273.5).toFixed(2)} &deg;C</h1>

            <div className={cx("degree")}>
              <h2>{data.weather[0].main}</h2>
              <p>
                {(data.main.temp_min - 273.5).toFixed(2)} &deg;C |{" "}
                {(data.main.temp_max - 273.5).toFixed(2)} &deg;C
              </p>
            </div>
          </div>
        </div>
        {filter ? (
          <div className={cx("toast__mess")}>
            <p>Don't find city</p>
            <i className={cx("fa-solid fa-triangle-exclamation")}></i>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default SearchWeather;
