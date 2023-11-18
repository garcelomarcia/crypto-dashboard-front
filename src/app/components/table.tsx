import Image from "next/image";
import { Order } from "../interfaces";
import { FilterCriteria } from "../page";
import { checkFilter } from "../utils/utils";

interface TableProps {
  orders: Order[];
  onRowClick: (pair: string) => void;
  filterCriteria: FilterCriteria;
}
const Table: React.FC<TableProps> = ({
  orders,
  onRowClick,
  filterCriteria,
}) => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Symbol
          </th>
          <th scope="col" className="px-6 py-3">
            Side
          </th>
          <th scope="col" className="px-6 py-3">
            Strength
          </th><th scope="col" className="px-6 py-3">
            Amount
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Distance (%)
          </th>
          <th scope="col" className="px-6 py-3">
            Time
          </th>
        </tr>
      </thead>
      <tbody>
        {orders &&
          orders.map((order, i) => {
            const formattedAmount = formatNumberWithKMB(Number(order.amount),1);
            return (
              <tr
                className={`${
                  !checkFilter(order,filterCriteria)
                    ? ""
                    : order.side === "buy"
                    ? "bg-gradient-to-r from-green-300 to-green-600 text-white"
                    : "bg-gradient-to-r from-red-300 to-red-600 text-white"
                } bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer`}
                key={i}
                onClick={() => onRowClick(order.pair)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Image
                    src={`https://s3-symbol-logo.tradingview.com/crypto/XTVC${order.pair}.svg`}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5 inline-block mr-1"
                  />
                  {/* Include your SVG paths or shapes here */}

                  {order.pair}
                </th>
                {order.side === "sell" ? (
                  <td className="px-6 py-4 bg-red-400 text-white">
                    {order.side}
                  </td>
                ) : (
                  <td className="px-6 py-4 bg-emerald-400 text-white">
                    {order.side}
                  </td>
                )}

                <td className="px-6 py-4">{order.strength}</td>
                <td className="px-6 py-4">{formattedAmount}</td>
                <td className="px-6 py-4">{order.price}</td>
                <td className="px-6 py-4">{order.distance}</td>
                <td className="px-6 py-4">{order.time}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;

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