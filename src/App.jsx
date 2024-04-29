import { useEffect, useState, useCallback } from "react";

import "./App.css";
import Papa from "papaparse";
import search from "./assets/icons/search.svg";
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard, MiniCard } from "./Components";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Select } from "antd";
import { defaultTo } from "lodash";
import dayjs from "dayjs";

function App() {
  const URL = "wss://ggfeiznqqj.execute-api.ap-southeast-1.amazonaws.com/stg";
  const [input, setInput] = useState("");
  const { weather, thisLocation, values, place, setPlace } = useStateContext();

  const dateNow = dayjs("2024-03-27").valueOf();
  const minDate = dayjs("2024-03-27").subtract(7, "days").valueOf();
  const [currentCO2, setCurrentCO2] = useState("");
  const [currentPM2, setCurrentPM2] = useState("");
  const [currentCH2O, setCurrentCH2O] = useState("");
  const [currentVOC, setCurrentVOC] = useState("");
  const [dataList, setDataList] = useState([]);
  const [dataPM2, setDataPM2] = useState([]);
  const [dataCO2, setDataCO2] = useState([]);
  const [dataVOC, setDataVOC] = useState([]);
  const [dataCH2O, setDataCH2O] = useState([]);
  const [deviceList, setDeviceList] = useState([
    {
      value: "eb320d1bf738421780gqaj",
      label: "eb320d1bf738421780gqaj",
    },
    {
      value: "eb2a60c77fdbab7810k0w6",
      label: "eb2a60c77fdbab7810k0w6",
    },
    {
      value: "eb10d0a3352b4b3597kboh",
      label: "eb10d0a3352b4b3597kboh",
    },
    {
      value: "eb17338bd6be497a7e5rm7",
      label: "eb17338bd6be497a7e5rm7",
    },

    {
      value: "eb30f4bf557caae46bcxdu",
      label: "eb30f4bf557caae46bcxdu",
    },

    {
      value: "ebc59ee9a41d1462fbneut",
      label: "ebc59ee9a41d1462fbneut",
    },
    {
      value: "ebc9fcf973b273dc4et9xg",
      label: "ebc9fcf973b273dc4et9xg",
    },
    {
      value: "ebd719fa99091b3aacesra",
      label: "ebd719fa99091b3aacesra",
    },
  ]);
  const [WSUrl, setWSUrl] = useState(`${URL}/?deviceId=${deviceList[0].value}`);
  const [selectedId, setSelectedId] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(WSUrl);

  const fetchAllDataList = useCallback(async () => {
    const data = Papa.parse(await fetchCsv(), {
      header: true,
    });

    console.log("[data]", data.data);

    const filterCO2 = data.data.filter(
      (item) =>
        item.code === "co2_value" &&
        item.device_id === deviceList[0].value &&
        dayjs(item.created_at).valueOf() >= minDate &&
        dayjs(item.created_at).valueOf() <= dateNow
    );
    setDataCO2(filterCO2);

    const filterVOC = data.data.filter(
      (item) =>
        item.code === "voc_value" &&
        item.device_id === deviceList[0].value &&
        dayjs(item.created_at).valueOf() >= minDate &&
        dayjs(item.created_at).valueOf() <= dateNow
    );
    setDataVOC(filterVOC);

    const filterPM25 = data.data.filter(
      (item) =>
        item.code === "pm25_value" &&
        item.device_id === deviceList[0].value &&
        dayjs(item.created_at).valueOf() >= minDate &&
        dayjs(item.created_at).valueOf() <= dateNow
    );
    setDataPM2(filterPM25);

    const filterCH2O = data.data.filter(
      (item) =>
        item.code === "ch2o_value" &&
        item.device_id === deviceList[0].value &&
        dayjs(item.created_at).valueOf() >= minDate &&
        dayjs(item.created_at).valueOf() <= dateNow
    );
    setDataCH2O(filterCH2O);

    setCurrentCO2(filterCO2[0].value);
    setCurrentPM2(filterPM25[0].value);
    setCurrentCH2O(filterCH2O[0].value);
    setCurrentVOC(filterVOC[0].value);

    setDataList(data.data);
  }, []);

  useEffect(() => {
    fetchAllDataList();
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      const item = JSON.parse(JSON.parse(lastMessage?.data).data.message);
      console.log("[item]", item);

      switch (item.code) {
        case "co2_value":
          setCurrentCO2(item.value);
          break;
        case "voc_value":
          setCurrentVOC(item.value);
          break;
        case "ch2o_value":
          setCurrentCH2O(item.value);
          break;
        case "pm25_value":
          setCurrentPM2(item.value);
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback((value) => {
    console.log("[updated url]", `${URL}/?deviceId=${value}`);
    setWSUrl(`${URL}/?deviceId=${value}`);
  }, []);

  const fetchCsv = async () => {
    const response = await fetch(`src/assets/cbsi_sensor.csv`);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = await decoder.decode(result.value);
    return csv;
  };

  const handleChangeDevice = (value) => {
    const filterCO2 = dataList.filter(
      (item) => item.code === "co2_value" && item.device_id === value
    );
    setDataCO2(filterCO2);

    const filterVOC = dataList.filter(
      (item) => item.code === "voc_value" && item.device_id === value
    );
    setDataVOC(filterVOC);

    const filterPM25 = dataList.filter(
      (item) => item.code === "pm25_value" && item.device_id === value
    );
    setDataPM2(filterPM25);

    const filterCH2O = dataList.filter(
      (item) => item.code === "ch2o_value" && item.device_id === value
    );
    setDataCH2O(filterCH2O);

    setCurrentCO2(defaultTo(filterCO2[0]?.value, "N/a"));
    setCurrentPM2(defaultTo(filterPM25[0]?.value, "N/a"));
    setCurrentCH2O(defaultTo(filterCH2O[0]?.value, "N/a"));
    setCurrentVOC(defaultTo(filterVOC[0]?.value, "N/a"));

    setSelectedId(value);
    handleClickChangeSocketUrl(value);
  };

  return (
    <div className="w-full h-screen text-white px-8">
      <nav className="w-full p-3 flex justify-between items-center">
        <h1 className="font-bold tracking-wide text-3xl text-blue-400">
          Concepcion Real-Time Indoor Air Quality Monitoring
        </h1>

        <div className="bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2">
          <img src={search} alt="search" className="w-[1.5rem] h-[1.5rem]" />
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                // sumit the form
                submitCity();
              }
            }}
            type="text"
            placeholder="Search Location"
            className="focus:outline-none w-full text-[#212121] text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </nav>

      <BackgroundLayout></BackgroundLayout>

      <main className="w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center">
        <>
          <Select
            placeholder="Select device ID"
            onChange={handleChangeDevice}
            options={deviceList}
          />
        </>

        <WeatherCard
          place={thisLocation}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
          currentCO2={currentCO2}
          currentPM2={currentPM2}
          currentCH2O={currentCH2O}
          currentVOC={currentVOC}
          dataPM2={dataPM2}
          dataCO2={dataCO2}
          dataVOC={dataVOC}
          dataCH2O={dataCH2O}
          selectedId={selectedId}
        />

        <div className="flex justify-center gap-8 flex-wrap w-[60%]">
          {values?.slice(1, 7).map((curr) => {
            return (
              <MiniCard
                key={curr.datetime}
                time={curr.datetime}
                temp={curr.temp}
                iconString={curr.conditions}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
