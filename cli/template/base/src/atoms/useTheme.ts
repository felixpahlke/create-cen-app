// export use Theme using recoil atom

import { atom, useRecoilState } from "recoil";

type CarbonTheme = "white" | "g90" | "g100" | "g10";


const themeState = atom<CarbonTheme>({
  key: "themeState",
  default: "white",
});

const useTheme = () => useRecoilState(themeState);

export default useTheme;
