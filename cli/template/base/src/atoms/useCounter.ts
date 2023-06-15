// export use Theme using recoil atom

import { atom, useRecoilState } from "recoil";

const counterState = atom<number>({
  key: "counter",
  default: 0,
});

const useCounter = () => useRecoilState(counterState);

export default useCounter;
