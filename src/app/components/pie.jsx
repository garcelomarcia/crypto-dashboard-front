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

Chart.register(CategoryScale, Tooltip, Legend, Colors, ArcElement);

const PieChart = ({ category }) => {
  const initialColors = randomColor({ count: 10 });
  const [categoryDetail, setCategoryDetail] = useState([]);

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
  };

  useEffect(() => {
    getCategoryData();
  }, [category]);

  const names = categoryDetail.map((coin) => coin.name);
  const coinsMarketCap = categoryDetail.map((coin) => coin.market_cap);

  const data = {
    labels: names,
    datasets: [
      {
        data: coinsMarketCap,
        backgroundColor: initialColors,
      },
    ],
  };
  const chartOptions = {
    maintainAspectRatio: true,
  };
  return <Pie data={data} options={chartOptions} />;
};

export default PieChart;
