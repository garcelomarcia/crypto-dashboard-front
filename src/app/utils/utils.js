import useSound from 'use-sound';
import marimbaSound from '../../../public/marimba.wav';
import liquidationSound from '../../../public/liquidation.wav';

export const useCustomSound = () => {
  const [playMarimba] = useSound(marimbaSound);
  const [playLiquidation] = useSound(liquidationSound);

  const playMarimbaSound = () => {
    playMarimba();
  };

  const playLiquidationSound = () => {
    playLiquidation();
  };

  return { playMarimbaSound, playLiquidationSound };
};

export const checkFilter = (order,filterCriteria) => {
  if (
    (!filterCriteria.pair || order.pair === filterCriteria.pair) &&
    (!filterCriteria.side || order.side === filterCriteria.side) &&
    (!filterCriteria.strength || order.strength >= filterCriteria.strength) &&
    (!filterCriteria.distance || order.distance < filterCriteria.distance) &&
    (!filterCriteria.time || order.time >= filterCriteria.time)
  ) {
    return true;
  }
  return false;
};