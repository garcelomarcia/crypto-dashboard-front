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
