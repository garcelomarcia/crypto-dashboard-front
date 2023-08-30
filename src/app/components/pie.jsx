import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CategoryScale,
  Tooltip,
  Legend,
  Colors,
  Chart,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import randomColor from "randomcolor";
import ColorThief from "colorthief";

Chart.register(CategoryScale, Tooltip, Legend, Colors, ArcElement);

const PieChart = ({ category }) => {
  const initialColors = randomColor({ count: 10 });
  const [categoryDetail, setCategoryDetail] = useState([]);
  const [colors, setColors] = useState([]);

  const getCategoryData = async () => {
    if (category === "") {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
      );
      setCategoryDetail(response.data.slice(0, 10));
    } else {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
      );
      setCategoryDetail(response.data.slice(0, 10));
    }
    getColors();
  };

  const getColors = async () => {
    const colorThief = new ColorThief();
    const colorsArray = [];
    const imageUrls = categoryDetail.map((coin) => coin.image);

    for (const imageUrl of imageUrls) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageUrl;

      const dominantColor = await new Promise((resolve) => {
        image.onload = () => {
          resolve(colorThief.getColor(image));
        };
      });

      // Convert RGB array to a string representation
      const rgbString = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

      colorsArray.push(rgbString);
    }

    setColors(colorsArray);
  };

  useEffect(() => {
    getCategoryData();
  }, [category]);

  const names = categoryDetail.map((coin) => coin.name);
  const coinsMarketCap = categoryDetail.map((coin) => coin.market_cap);
  const pieColors = colors.length > 0 ? colors : initialColors;

  const data = {
    labels: names,
    datasets: [
      {
        data: coinsMarketCap,
        backgroundColor: pieColors,
      },
    ],
  };
  const chartOptions = {
    maintainAspectRatio: true,
  };
  console.log(colors);
  return <Pie data={data} options={chartOptions} />;
};

export default PieChart;
