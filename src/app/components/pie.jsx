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

Chart.register(
  CategoryScale,
  Tooltip,
  Legend,
  Colors,
  ArcElement,
);

const PieChart = ({ category }) => {
  const initialColors = randomColor({ count: 10 });
  const [categoryDetail, setCategoryDetail] = useState([]);
  const [colors, setColors] = useState(initialColors);
  const [isLoading, setIsLoading] = useState(true);

  const getCategoryDetail = async () => {
    try {
      const apiUrl =
        category === ""
          ? "https://assuring-guiding-pony.ngrok-free.app/api/"
          : `https://assuring-guiding-pony.ngrok-free.app/api/${category}`;
      const coinResponse = await axios.get(apiUrl);
      const coinsDetail = coinResponse.data.slice(0, 10);
      setCategoryDetail(coinsDetail);
      return coinsDetail;
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const getData = async () => {
    try {
      const coinsDetail = await getCategoryDetail();
      const imageUrls = coinsDetail.map((coin) => coin.image.split("?")[0]);
      const colorsResponse = await axios.post(
        "https://assuring-guiding-pony.ngrok-free.app/api/colors",
        imageUrls
      );
      setColors(colorsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [category]);

  const names = categoryDetail.map((coin) => coin.name);
  const coinsMarketCap = categoryDetail.map((coin) => coin.market_cap);
  const urlStrings = categoryDetail.map((coin) => coin.image.split("?")[0]);
  const imagesArray = urlStrings.map((url) => ({
    src: url,
    width: 12,
    height: 12,
  }));

  const data = {
    labels: names,
    datasets: [
      {
        data: coinsMarketCap,
        backgroundColor: colors,
      },
    ],
  };
  const chartOptions = {
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        render: "image",
        images: imagesArray,
      },
    },
  };
  console.log(imagesArray);
  return isLoading ? (
    <></>
  ) : (
      <Pie data={data} options={chartOptions} className="cursor-pointer" />
  );
};

export default PieChart;
