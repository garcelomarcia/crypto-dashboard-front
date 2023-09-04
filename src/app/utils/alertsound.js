import useSound from "use-sound";
import debounce from "lodash/debounce";
import sound from "../../../public/preview.mp3"


export const playSound = () => {
  const [play] = useSound(sound);
  play();
};

export const debouncedPlaySound = debounce(playSound, 3600000); // 3600000 milliseconds = 1 hour

