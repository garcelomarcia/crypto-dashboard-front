// TradingViewWidget.jsx

import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingViewWidget({pair}) {
  const onLoadScriptRef = useRef();
  const fixedPair = pair.includes("USDT") ? pair : pair+"USDT"
  console.log(fixedPair)

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_18b7a") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${fixedPair}`,
          interval: "1",
          timezone: "America/Mexico_City",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          gridColor: "rgba(240, 243, 250, 0)",
          allow_symbol_change: true,
          container_id: "tradingview_18b7a",
        });
      }
    }
  }, [pair]);

  return (
    <div className="tradingview-widget-container h-full">
      <div id="tradingview_18b7a" className="h-full"/>
    </div>
  );
}
