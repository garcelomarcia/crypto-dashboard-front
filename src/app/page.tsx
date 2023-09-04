"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Order, Liquidation } from "./interfaces";
import Table from "./components/table";
import Liquidations from "./components/liquidations";
import TradingViewWidget from "./components/tradingview";
import HorizontalBarChart from "./components/categories";
import PieChart from "./components/pie";
import { ToastContainer, toast } from "react-toastify";
import useSound from "use-sound";
import debounce from "lodash/debounce";
import sound from "../../public/marimba.wav";
import liquidation from "../../public/liquidation.wav";

const socket = io("https://fast-delivery-server.xyz/");

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [alertOrders, setAlertOrders] = useState<Order[]>([]);
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pair, setPair] = useState("BTCUSDT");

  const [play] = useSound(sound);
  const [playLiquidation] = useSound(liquidation);
  const debouncedPlaySound = debounce(() => play(), 3600000); // 3600000 milliseconds = 1 hour

  const handleRowClick = (selectedPair: string) => {
    setPair(selectedPair);
  };

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOrderAlerts = () => {
    // Check if any order has a distance less than 0.5 and play the sound
    const isAlertTriggered = orders.some(
      (order: Order) => order.distance < 0.5
    );

    if (isAlertTriggered) {
      debouncedPlaySound(); // Play the sound, but only once per hour
    }
  };

  useEffect(() => {
    socket.on("initialOrders", (data) => setAlertOrders(data));
    socket.on("databaseChange", (data) => {
      setOrders(data);
    });
    socket.on("liquidationsChange", (data) => {
      setLiquidations(data);
    });
  }, []);

  useEffect(() => {
    handleOrderAlerts();
  }, [orders]);

  useEffect(() => {
    playLiquidation();
    toast("New Liquidation!");
  }, [liquidations]);

  console.log(liquidations);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col xl:flex-row px-4 xl:px-10">
        <div className="w-full xl:w-2/3 xl:pr-4 mb-4 xl:mb-0">
          <h1 className="font-sans text-lg">Chart</h1>
          <div className="h-screen xl:h-2/3">
            <TradingViewWidget pair={pair} />
          </div>
        </div>
        <div className="w-full xl:w-1/3">
          <div className="mb-4">
            <h1 className="font-sans text-lg">Big Orders</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-3xl">
              <Table orders={orders} onRowClick={handleRowClick} />
            </div>
          </div>
          <div>
            <h1 className="font-sans text-lg">Liquidations</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-3xl">
              <Liquidations
                liquidations={liquidations}
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:flex flex-col xl:flex-row justify-between h-screen">
        <div className="xl:w-1/2 xl:pr-4">
          <h1 className="font-sans text-lg">MarketCap by Category</h1>
          <HorizontalBarChart handleCategory={handleCategory} />
        </div>
        <div className="xl:w-1/2">
          <h1 className="font-sans text-lg">Category Detail</h1>

          <PieChart category={selectedCategory} />
        </div>
      </div>
      <div>
        <button onClick={playLiquidation}></button>
      </div>
    </div>
  );
}
