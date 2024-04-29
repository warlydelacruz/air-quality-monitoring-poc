/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { useDate } from "../Utils/useDate";
import sun from "../assets/icons/sun.png";
import cloud from "../assets/icons/cloud.png";
import fog from "../assets/icons/fog.png";
import rain from "../assets/icons/rain.png";
import snow from "../assets/icons/snow.png";
import storm from "../assets/icons/storm.png";
import wind from "../assets/icons/windy.png";
import "../index.css";
import { groupBy, maxBy, minBy, reverse } from "lodash";

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
  currentCO2,
  currentPM2,
  currentVOC,
  currentCH2O,
  dataPM2,
  dataCO2,
  dataVOC,
  dataCH2O,
  selectedId,
}) => {
  const [icon, setIcon] = useState(sun);
  const [co2List, setCO2List] = useState([]);
  const { time } = useDate();
  const [chartKeys, setChartKeys] = useState([]);
  const [chartPM2Keys, setChartPM2Keys] = useState([]);
  const [chartVOCKeys, setChartVOCKeys] = useState([]);
  const [chartCH2OKeys, setChartCH2OKeys] = useState([]);
  const [co2Data, setCO2Data] = useState({
    data: [],
    min: 0,
    max: 0,
  });
  const [pm25Data, setPM25Data] = useState({
    data: [],
    min: 0,
    max: 0,
  });
  const [vocData, setVOCData] = useState({
    data: [],
    min: 0,
    max: 0,
  });
  const [ch2oData, setCH20Data] = useState({
    data: [],
    min: 0,
    max: 0,
  });

  useEffect(() => {
    setCO2Data({
      data: [],
      min: 0,
      max: 0,
    });
    setPM25Data({
      data: [],
      min: 0,
      max: 0,
    });
    setVOCData({
      data: [],
      min: 0,
      max: 0,
    });
    setCH20Data({
      data: [],
      min: 0,
      max: 0,
    });
  }, [selectedId]);

  useEffect(() => {
    const groupedCO2 = groupBy(dataCO2, "created_at");
    const reverseKeys = reverse(Object.keys(groupedCO2));
    setChartKeys(reverseKeys);

    reverseKeys.forEach((key) => {
      setCO2Data((prev) => {
        const maxData = parseInt(
          maxBy(groupedCO2[key], (item) => item.value).value
        );

        const max = parseInt(maxBy(dataCO2, (item) => item.value).value);
        const min = parseInt(minBy(dataCO2, (item) => item.value).value);

        return {
          data: [...prev.data, maxData],
          max,
          min,
        };
      });
    });
  }, [dataCO2]);

  useEffect(() => {
    const groupedPM2 = groupBy(dataPM2, "created_at");
    const reverseKeys = reverse(Object.keys(groupedPM2));
    setChartPM2Keys(reverseKeys);

    reverseKeys.forEach((key) => {
      setPM25Data((prev) => {
        const maxData = parseInt(
          maxBy(groupedPM2[key], (item) => parseInt(item.value)).value
        );

        const max = parseInt(
          maxBy(dataPM2, (item) => parseInt(item.value)).value
        );
        const min = parseInt(
          minBy(dataPM2, (item) => parseInt(item.value)).value
        );

        return {
          data: [...prev.data, maxData],
          max,
          min,
        };
      });
    });
  }, [dataPM2]);

  useEffect(() => {
    const groupedVOC = groupBy(dataVOC, "created_at");
    const reverseKeys = reverse(Object.keys(groupedVOC));
    setChartVOCKeys(reverseKeys);

    reverseKeys.forEach((key) => {
      setVOCData((prev) => {
        const maxData = parseInt(
          maxBy(groupedVOC[key], (item) => parseInt(item.value)).value
        );

        const max = parseInt(
          maxBy(dataVOC, (item) => parseInt(item.value)).value
        );
        const min = parseInt(
          minBy(dataVOC, (item) => parseInt(item.value)).value
        );

        return {
          data: [...prev.data, maxData],
          max,
          min,
        };
      });
    });
  }, [dataVOC]);

  useEffect(() => {
    const groupedCH2O = groupBy(dataCH2O, "created_at");
    const reverseKeys = reverse(Object.keys(groupedCH2O));
    setChartCH2OKeys(reverseKeys);

    reverseKeys.forEach((key) => {
      setCH20Data((prev) => {
        const maxData = parseInt(
          maxBy(groupedCH2O[key], (item) => parseInt(item.value)).value
        );

        const max = parseInt(
          maxBy(dataCH2O, (item) => parseInt(item.value)).value
        );
        const min = parseInt(
          minBy(dataCH2O, (item) => parseInt(item.value)).value
        );

        return {
          data: [...prev.data, maxData],
          max,
          min,
        };
      });
    });
  }, [dataCH2O]);

  useEffect(() => {
    if (iconString) {
      if (iconString.toLowerCase().includes("cloud")) {
        setIcon(cloud);
      } else if (iconString.toLowerCase().includes("rain")) {
        setIcon(rain);
      } else if (iconString.toLowerCase().includes("clear")) {
        setIcon(sun);
      } else if (iconString.toLowerCase().includes("thunder")) {
        setIcon(storm);
      } else if (iconString.toLowerCase().includes("fog")) {
        setIcon(fog);
      } else if (iconString.toLowerCase().includes("snow")) {
        setIcon(snow);
      } else if (iconString.toLowerCase().includes("wind")) {
        setIcon(wind);
      }
    }
  }, [iconString]);

  const chartConfig = {
    type: "bar",
    height: 150,
    series: [
      {
        name: "CO2",
        data: [...co2Data.data],
      },
    ],
    options: {
      chart: {
        width: "100%",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: "95%",
        },
      },
      xaxis: {
        position: "top",
        categories: chartKeys,
      },
      yaxis: {
        stepSize: 200,
        labels: {
          show: false,
        },
        title: {
          text: "CO2",
          rotate: 360,
          offsetX: 5,
        },
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  const chartPM2Config = {
    type: "bar",
    height: 150,
    series: [
      {
        name: "PM2.5",
        data: [...pm25Data.data],
      },
    ],
    options: {
      chart: {
        width: "100%",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: "95%",
        },
      },
      xaxis: {
        position: "top",
        categories: chartPM2Keys,
      },
      yaxis: {
        stepSize: 10,
        labels: {
          show: false,
        },
        title: {
          text: "PM2.5",
          rotate: 360,
          offsetX: 5,
        },
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  const chartVOCConfig = {
    type: "bar",
    height: 150,
    series: [
      {
        name: "VOC",
        data: [...vocData.data],
      },
    ],
    options: {
      chart: {
        width: "100%",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: "95%",
        },
      },
      xaxis: {
        position: "top",
        categories: chartVOCKeys,
      },
      yaxis: {
        stepSize: 40,
        labels: {
          show: false,
        },
        title: {
          text: "VOC",
          rotate: 360,
          offsetX: 5,
        },
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  const chartCH2OConfig = {
    type: "bar",
    height: 150,
    series: [
      {
        name: "CH2O",
        data: [...ch2oData.data],
      },
    ],
    options: {
      chart: {
        width: "100%",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: "95%",
        },
      },
      xaxis: {
        position: "top",
        categories: chartCH2OKeys,
      },
      yaxis: {
        stepSize: 10,
        labels: {
          show: false,
        },
        title: {
          text: "CH2O",
          rotate: 360,
          offsetX: 5,
        },
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="glassCard p-4 w-screen">
      <div className="flex w-full just-center, items-center gap-4 mt-12 mb-4">
        <img src={icon} alt="weather_icon" />
        <p className="font-bold text-5xl flex justify-center items-center">
          {temperature} &deg;C
        </p>
      </div>

      <div className="font-bold text-center text-xl">{place}</div>

      <div className="w-full flex justify-between items-center mt-4">
        <p className="flex-1 text-center p-2">{new Date().toDateString()}</p>
        <p className="flex-1 text-center p-2">{time}</p>
      </div>

      <div className="w-full flex justify-between items-center mt-4 gap-2">
        <p className="flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg">
          CO2 {currentCO2}
          <p className="font-normal">{windspeed} ppm</p>
        </p>

        <p className="flex-1 text-center p-2 font-bold rounded-lg bg-green-600">
          PM {currentPM2} <p className="font-normal">{humidity} ppm</p>
        </p>
      </div>

      <div className="w-full p-3 mt-4 flex justify-between items-center">
        <p className="font-semibold text-lg">CH2O(Formaldehyde)</p>
        <p className="text-lg">{currentCH2O ? currentCH2O : "N/A"}</p>
      </div>

      <div className="w-full p-3 mt-4 flex justify-between items-center">
        <p className="font-semibold text-lg">VOC</p>
        <p className="text-lg">{currentVOC ? currentVOC : "N/A"}</p>
      </div>

      <hr className="bg-slate-600" />

      <div className="w-full mt-2 mb-0 flex">
        <ReactApexChart {...chartConfig} className="basis-5/6" />
        <div className="flex flex-col justify-center basis-1/6">
          <p className="font-semibold text-lg text-rose-600">{co2Data.max}</p>
          <p className="font-semibold text-lg text-yellow-700">{co2Data.min}</p>
        </div>
      </div>

      <div className="w-full mb-0 flex">
        <ReactApexChart {...chartPM2Config} className="basis-5/6" />
        <div className="flex flex-col justify-center basis-1/6">
          <p className="font-semibold text-lg text-rose-600">{pm25Data.max}</p>
          <p className="font-semibold text-lg text-yellow-700">
            {pm25Data.min}
          </p>
        </div>
      </div>

      <div className="w-full mb-0 flex">
        <ReactApexChart {...chartVOCConfig} className="basis-5/6" />
        <div className="flex flex-col justify-center basis-1/6">
          <p className="font-semibold text-lg text-rose-600">{vocData.max}</p>
          <p className="font-semibold text-lg text-yellow-700">{vocData.min}</p>
        </div>
      </div>

      <div className="w-full mb-0 flex">
        <ReactApexChart {...chartCH2OConfig} className="basis-5/6" />
        <div className="flex flex-col justify-center basis-1/6">
          <p className="font-semibold text-lg text-rose-600">{ch2oData.max}</p>
          <p className="font-semibold text-lg text-yellow-700">
            {ch2oData.min}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
