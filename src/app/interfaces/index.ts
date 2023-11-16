export interface Order {
  id?: number;
  pair: string;
  side: string;
  strength: number;
  amount: number;
  price: number;
  distance: number;
  time: number;
}

export interface Liquidation {
  symbol: string;
  side: string;
  volume: string;
  avgvolume: string;
  quantity: string;
  time: string;
}
