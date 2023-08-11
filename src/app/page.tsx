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

  console.log(pair)

  return (
    <div className="flex flex-col h-screen px-10">
      <h1 className="font-sans text-lg px-2 mx-auto">Chart</h1>
      <div className="h-2/3">
        <TradingViewWidget pair={pair} />
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between h-1/3">
        <div className="w-2/3">
          <h1 className="font-sans text-lg px-2">Big Orders</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-3xl">
            <Table orders={orders} onRowClick={handleRowClick} />
          </div>
        </div>
        <div className="w-1/3">
          <h1 className="font-sans text-lg px-2">Liquidations</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-3xl">
            <Liquidations liquidations={liquidations} onRowClick={handleRowClick}/>
          </div>
        </div>
      </div>
    </div>
  );
}
