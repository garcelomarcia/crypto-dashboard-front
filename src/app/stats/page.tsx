"use client";
import React, { useState, useEffect } from "react";
import HorizontalBarChart from "../components/categories";
import PieChart from "../components/pie";
import GaugeChart from "../components/gauge";
import Sidebar, { SidebarItem } from "../components/sidebar";
import { Speakeron, Speakeroff, Piesvg, Chartsvg } from "../components/svgs";
export default function Stats() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const handleCategory = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <div className="w-full">
      <div className="py-2 flex w-full">
        <Sidebar>
          <SidebarItem
            text="Live Data"
            icon={<Chartsvg />}
            href="/"
            active={false}
            alert={false}
          />
          <SidebarItem
            text="Crypto Statistics"
            icon={<Piesvg />}
            active={false}
            alert={false}
            href="/stats"
          />
        </Sidebar>
        <div className="flex flex-col w-full h-screen">
          <div className="h-1/2">
            <div className="flex flex-row justify-between px-4">
              <div className="w-1/3">
                <h1 className="font-sans text-lg">MarketCap by Category</h1>
                <HorizontalBarChart handleCategory={handleCategory} />
              </div>
              <div className="w-1/3">
                <h1 className="font-sans text-lg">Fear & Greed Index</h1>
                <GaugeChart />
              </div>
            </div>
          </div>
          <div className="h-1/2">
            <div className="flex flex-row justify-between px-4">
              <div className="w-1/3">
                <h1 className="font-sans text-lg">Category Detail</h1>
                <PieChart category={selectedCategory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
