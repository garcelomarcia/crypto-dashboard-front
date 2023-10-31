import React, { useEffect } from "react";
import { Chart, ArcElement, LinearScale, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, LinearScale, Title, Tooltip);

const data = {
  labels: ["Red", "Orange", "Yellow", "Lime", "Green"],
  datasets: [
    {
      data: [20, 20, 20, 20, 20], // Adjust values as needed
      backgroundColor: ["red", "orange", "yellow", "lime", "green"], // Adjust colors as needed
    },
  ],
};

const options = {
  cutout: 70, // Adjust this value to control the size of the cutout (in pixels)
  rotation: -90,
  circumference: 180,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Fear & Greed Index",
      position: "bottom",
    },
  },
};

const gaugeOptions = {
  needle: {
    data:75,
    lineColor: "gray",
  },
};

const ChartNeedle = ({ options }) => {
    useEffect(() => {
      const canvas = document.getElementById("myChart");
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        const startAngle = 0;
        const endAngle = 180;
        const midAngle = 90;
  
        const centerX = canvas.width / 2; // Adjust according to your container's width
        const centerY = canvas.height / 2; // Adjust according to your container's height
  
        ctx.beginPath();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((midAngle * Math.PI) / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, -3);
        ctx.lineTo(-15, 3);
        ctx.fillStyle = options.needle.lineColor;
        ctx.fill();
        ctx.restore();
        ctx.closePath();
      }
    }, [options]);
  
    return null;
  };
  

const GaugeChart = () => {
  return (
    <div style={{ position: "relative", width: "300px", height: "300px" }}>
      <Doughnut id="myChart" data={data} options={options} />
      <ChartNeedle options={gaugeOptions} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
        }}
      >
        {gaugeOptions.needle.data}
      </div>
    </div>
  );
};

export default GaugeChart;
