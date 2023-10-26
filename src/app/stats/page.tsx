"use client";
import React, { useState, useEffect } from "react";
import HorizontalBarChart from "../components/categories";
import PieChart from "../components/pie";
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
          <SidebarItem text="Live Data" icon={<Chartsvg />} href="/" />
          <SidebarItem
            text="Crypto Statistics"
            icon={<Piesvg />}
            href="/stats"
          />
        </Sidebar>
        <div className="flex-1 w-full">
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
        </div>
      </div>
    </div>
  );
}
