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
    const apiUrl =
      category === ""
        ? "https://fast-delivery-server.xyz/api/"
        : `https://fast-delivery-server.xyz/api/${category}`;

    try {
      const response = await axios.get(apiUrl);
      setCategoryDetail(response.data.slice(0, 10));
      getColors();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getColors = async () => {
    const imageUrls = req.body.map((coin) => coin.image);
    const response = await axios.post("https://fast-delivery-server/api/", {
      body: imageUrls,
    });

    setColors(response.data);
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
