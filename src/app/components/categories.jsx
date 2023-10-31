import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LinearScale,
  CategoryScale,
  Tooltip,
  Colors,
  Chart,
  BarController,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import randomColor from "randomcolor";

Chart.register(LinearScale, CategoryScale, Tooltip, Colors, BarElement); 

const HorizontalBarChart = ({ handleCategory }) => {
  const [globalData, setGlobalData] = useState({});
  const [coinData, setCoinData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [initialColors, setInitialColors] = useState(
    randomColor({ count: 10 })
  );
  const [renderColors, setRenderColors] = useState(initialColors);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const globalResponse = await axios.get(
        "https://api.coingecko.com/api/v3/global"
      );
      const categoryResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/categories"
      );
      setCoinData(categoryResponse.data.slice(0, 10));
      setGlobalData(globalResponse.data.data);
    } catch (error) {
      console.error("Error fetching global market data:", error);
    }
  };

  useEffect(() => {
    getData();
    setIsLoading(false);
  }, []);

  const categories = coinData.map((coin) => coin.name);
  const categoriesMarketCap = coinData.map((coin) => coin.market_cap);

  const data = {
    labels: categories,
    datasets: [
      {
        axis: "y",
        data: categoriesMarketCap,
        backgroundColor: renderColors,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false, // Set to false to hide the legend
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        if (selectedCategory === clickedIndex) {
          setRenderColors(initialColors);
          handleCategory("");
          setSelectedCategory(null);
        } else {
          handleCategory(coinData[clickedIndex].id);
          setSelectedCategory(elements[0].index);
          const newColors = initialColors.map((color, index) =>
            index === clickedIndex ? color : 0
          );
          setRenderColors(newColors);
        }
      }
    },
  };

  return isLoading ? (
    <></>
  ) : (
    <Bar data={data} options={chartOptions} className="cursor-pointer" />
  );
};

export default HorizontalBarChart;
