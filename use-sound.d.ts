declare module "use-sound" {
    type PlayFunction = () => void;
  
    interface UseSound {
      play: PlayFunction;
    }
  
    // Define the useSound function that returns the custom type
    const useSound: (sound: string) => [UseSound];
  
    // Export the useSound function as the default export
    export default useSound;
  }
  