"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Order, Liquidation } from "./interfaces";
import Table from "./components/table";
import Liquidations from "./components/liquidations";
import TradingViewWidget from "./components/tradingview";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCustomSound, checkFilter } from "./utils/utils";
import { Speakeron, Speakeroff, Piesvg, Chartsvg } from "./components/svgs";

const socket = io("https://fast-delivery-server.xyz/");

export interface FilterCriteria {
  pair?: string;
  side?: string;
  strength?: number;
  distance?: number;
  time?: number;
}

export default function Home() {
  const { playMarimbaSound, playLiquidationSound } = useCustomSound();

  const [orders, setOrders] = useState<Order[]>([]);
  const [alertOrders, setAlertOrders] = useState<Order[]>([]);
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [pair, setPair] = useState("BTCUSDT");
  const [isLoading, setIsLoading] = useState(true);
  const [enableOrdersSound, setEnableOrdersSound] = useState(false);
  const [enableLiquidationsSound, setEnableLiquidationsSound] = useState(false);
  const [liquidationsFilter, setLiquidationsFilter] = useState("5000");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    strength: 10,
    distance: 0.5,
    time: 60,
  });

  const handleRowClick = (selectedPair: string) => {
    setPair(selectedPair);
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
    const ordersClose = orders.filter((order: Order) => {
      if (checkFilter(order, filterCriteria)) return order;
    });

    const difference = getArrayDifference(ordersClose, alertOrders);
    // console.log("ORDERS CLOSE", ordersClose);
    // console.log("ALERT ORDERS", alertOrders);
    // console.log("DIFFERENCE", difference);
    if (difference.length > 0) {
      if (enableOrdersSound) {
        playMarimbaSound();
      }

      toast(`Big Order Alert ${difference[0].pair} @ ${difference[0].price}`, {
        position: "top-center",
        autoClose: 15000,
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
  }, [orders]);

  useEffect(() => {
    if (!isLoading) {
      if (enableLiquidationsSound) playLiquidationSound();
      if (liquidations.length > 0) {
        toast.error(`New Liquidation on symbol ${liquidations[0].symbol}`, {
          position: "top-center",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }, [liquidations]);

  useEffect(() => {
    if (orders.length > 0 && liquidations.length > 0) setIsLoading(false);
  }, [orders, liquidations]);

  console.log(liquidationsFilter);

  return (
    <div className="w-full">
      <div className="py-2 flex w-full">
        <Sidebar>
          <SidebarItem text="Live Data" icon={<Chartsvg />} href="/" />
          <SidebarItem
            text="Crypto Statistics"
            icon={<Piesvg />}
            href="/stats"
          />
        </Sidebar>
        <div className="flex-1 w-full">
          <div
            className="flex flex-col xl:flex-row xl:justify-between"
            id="notifications"
          >
            <div className="w-full xl:w-2/3 xl:pr-4 mb-4 xl:mb-0">
              <div className="flex flex-row">
                <h1 className="px-4 xl:px-10 font-sans text-lg">
                  Orders Notification Filter
                </h1>
                <button
                  onClick={() =>
                    setEnableOrdersSound(
                      (prevEnableOrdersSound) => !prevEnableOrdersSound
                    )
                  }
                >
                  {enableOrdersSound ? <Speakeron /> : <Speakeroff />}
                </button>
              </div>
              <div className="flex flex-row justify-between px-4 xl:px-10 items-center">
                <form>
                  <div className="flex flex-row justify-between mb-4">
                    <div className="m-2">
                      <h3 className=" text-sm mb-1">Quantity</h3>
                      <input
                        type="text"
                        placeholder={filterCriteria.pair}
                        value={filterCriteria.pair}
                        onChange={(e) =>
                          setFilterCriteria({
                            ...filterCriteria,
                            pair: e.target.value,
                          })
                        }
                        className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-32"
                      />
                    </div>
                    <div className="m-2">
                      <h3 className=" text-sm mb-1">Side</h3>
                      <select
                        value={filterCriteria.side}
                        onChange={(e) =>
                          setFilterCriteria({
                            ...filterCriteria,
                            side: e.target.value,
                          })
                        }
                        className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        <option value=""></option>
                        <option value="buy">buy</option>
                        <option value="sell">sell</option>
                      </select>
                    </div>

                    <div className="m-2">
                      <h3 className="text-sm mb-1">Strength {">="}</h3>
                      <input
                        type="number"
                        value={filterCriteria.strength || ""}
                        onChange={(e) =>
                          setFilterCriteria({
                            ...filterCriteria,
                            strength: parseFloat(e.target.value) || NaN,
                          })
                        }
                        className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-24"
                      />
                    </div>
                    <div className="m-2">
                      <h3 className="text-sm mb-1">Distance {"<"}</h3>
                      <input
                        type="number"
                        value={filterCriteria.distance || ""}
                        onChange={(e) =>
                          setFilterCriteria({
                            ...filterCriteria,
                            distance: parseFloat(e.target.value) || NaN,
                          })
                        }
                        className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-24"
                      />
                    </div>
                    <div className="m-2">
                      <h3 className=" text-sm mb-1">Time {">="}</h3>
                      <input
                        type="number"
                        value={filterCriteria.time || ""}
                        onChange={(e) =>
                          setFilterCriteria({
                            ...filterCriteria,
                            time: parseFloat(e.target.value) || NaN,
                          })
                        }
                        className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-24"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full xl:w-1/3">
              <div>
                <div className="flex flex-row justify-start">
                  <h1 className="font-sans text-lg">
                    Liquidations Notification Filter
                  </h1>
                  <button
                    className="ml-10"
                    onClick={() =>
                      setEnableLiquidationsSound(
                        (prevEnableLiquidationsSound) =>
                          !prevEnableLiquidationsSound
                      )
                    }
                  >
                    {enableLiquidationsSound ? <Speakeron /> : <Speakeroff />}
                  </button>
                </div>
                <div className="flex flex-row justify-start">
                  <form>
                    <div className="flex flex-row justify-between mb-4">
                      <div className="m-2">
                        <h3 className=" text-sm mb-1">Quantity</h3>
                        <input
                          type="text"
                          placeholder={liquidationsFilter}
                          value={liquidationsFilter}
                          onChange={(e) =>
                            setLiquidationsFilter(e.target.value)
                          }
                          className="bg-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 w-32"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
                  <Table
                    orders={orders}
                    onRowClick={handleRowClick}
                    filterCriteria={filterCriteria}
                  />
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
          <div>
            <button onClick={playLiquidationSound}></button>
            <button onClick={playMarimbaSound}></button>
          </div>
        </div>
      </div>
    </div>
  );
}
