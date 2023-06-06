// export use Theme using recoil atom

import { atom, useRecoilState } from "recoil";

const themeState = atom({
  key: "themeState",
  default: "white",
});

export default () => useRecoilState(themeState);
