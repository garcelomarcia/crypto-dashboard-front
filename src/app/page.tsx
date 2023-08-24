"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Order, Liquidation } from "./interfaces";
import Table from "./components/table";
import Liquidations from "./components/liquidations";
import TradingViewWidget from "./components/tradingview";

const socket = io("https://fast-delivery-server.xyz/");

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [pair, setPair] = useState("BTCUSDT");

  const handleRowClick = (selectedPair: string) => {
    setPair(selectedPair);
  };

  useEffect(() => {
    socket.on("databaseChange", (data) => {
      setOrders(data);
      console.log("New Big Orders:", data);
    });
    socket.on("liquidationsChange", (data) => {
      setLiquidations(data);
      console.log("New Liquidations:", data);
    });
  }, []);

  console.log(pair);
  return (
    <div>
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
    </div>
  );
}
