import Image from "next/image";
import { Liquidation } from "../interfaces";

interface TableProps {
  liquidations: Liquidation[];
  onRowClick: (pair: string) => void;
}
const Liquidations: React.FC<TableProps> = ({ liquidations, onRowClick }) => {
  console.log(liquidations);
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Symbol
          </th>
          <th scope="col" className="px-6 py-3">
            Amount
          </th>
          <th scope="col" className="px-6 py-3">
            Volume
          </th>
          <th scope="col" className="px-6 py-3">
            Time
          </th>
        </tr>
      </thead>
      <tbody>
        {liquidations &&
          liquidations.map((order, i) => {
            let symbol: string = order.symbol.includes("USDT")
              ? order.symbol.split("USDT")[0]
              : order.symbol;

            // Format order.volume with dollar sign, K, and M
            const formattedVolume =
              "$" + formatNumberWithKMB(Number(order.volume), 1);

            // Format order.quantity with K and M
            const formattedQuantity = formatNumberWithKMB(
              Number(order.quantity),
              1
            );

            return (
              <tr
                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  order.side === "BUY"
                    ? "bg-gradient-to-r from-green-300 to-green-600"
                    : "bg-gradient-to-r from-red-300 to-red-600"
                } cursor-pointer`}
                key={i}
                onClick={() => onRowClick(order.symbol)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Image
                    src={`https://s3-symbol-logo.tradingview.com/crypto/XTVC${symbol}.svg`}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5 inline-block mr-1"
                  />
                  {/* Include your SVG paths or shapes here */}
                  {order.symbol}
                </th>
                <td className="px-6 py-4 text-white">{formattedVolume}</td>
                <td className="px-6 py-4 text-white">{formattedQuantity}</td>
                <td className="px-6 py-4 text-white">
                  {order.time.split(".")[0]}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Liquidations;

// Function to format numbers with K, M, or B for thousands, millions, or billions
function formatNumberWithKMB(number: number, decimals: number): string {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(decimals) + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(decimals) + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(decimals) + "K";
  } else {
    return number.toFixed(decimals);
  }
}
