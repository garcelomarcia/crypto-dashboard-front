"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Order, Liquidation } from "./interfaces";
import Table from "./components/table";
import Liquidations from "./components/liquidations";
import TradingViewWidget from "./components/tradingview";
import HorizontalBarChart from "./components/categories";
import PieChart from "./components/pie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCustomSound } from "./utils/useCustomSound";
import debounce from "lodash/debounce";

const socket = io("https://fast-delivery-server.xyz/");

export default function Home() {
  const { playMarimbaSound, playLiquidationSound } = useCustomSound();

  const [orders, setOrders] = useState<Order[]>([]);
  const [alertOrders, setAlertOrders] = useState<Order[]>([]);
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pair, setPair] = useState("BTCUSDT");
  const [isLoading, setIsLoading] = useState(true);

  const handleRowClick = (selectedPair: string) => {
    setPair(selectedPair);
  };

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  const clickFirstButton = () => {
    if (firstButtonRef.current) {
      firstButtonRef.current.click();
    }
  };

  function getArrayDifference(array1: Order[], array2: Order[]) {
    const compareObjects = (obj1: Order, obj2: Order) => {
      return obj1.id === obj2.id;
    };

    const difference = array1.filter((item1) => {
      return !array2.some((item2) => compareObjects(item1, item2));
    });

    return difference;
  }

  const handleOrderAlerts = () => {
    const ordersClose = orders.filter((order: Order) => order.distance < 0.5);
    const difference = getArrayDifference(ordersClose, alertOrders);
    console.log("ORDERS CLOSE", ordersClose);
    console.log("ALERT ORDERS", alertOrders);
    console.log("DIFFERENCE", difference);
    if (difference.length > 0) {
      clickFirstButton();
      toast(`Big Order Alert ${difference[0].pair} @ ${difference[0].price}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAlertOrders(ordersClose);
    }
  };

  useEffect(() => {
    socket.on("databaseChange", (data) => {
      setOrders(data);
    });
    socket.on("liquidationsChange", (data) => {
      setLiquidations(data);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      handleOrderAlerts();
    }
  }, [orders, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      playLiquidationSound();
      if (liquidations.length > 0) {
        toast.error(`New Liquidation on symbol ${liquidations[0].symbol}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }, [liquidations, isLoading]);

  console.log(alertOrders);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
        <button onClick={playLiquidationSound}>.</button>
        <button onClick={playMarimbaSound} ref={firstButtonRef}>
          .
        </button>
      </div>
    </div>
  );
}
