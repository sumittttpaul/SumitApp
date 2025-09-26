import { observable } from "@legendapp/state";

const category$ = observable<{ index: number; width: number; left: number }>({ index: -1, width: 0, left: 0 });

const setIndex = (value: number) => category$.assign({ index: value });
const setWidth = (value: number) => category$.assign({ width: value });
const setLeft = (value: number) => category$.assign({ left: value });

const NavState = () => ({
  index: category$.index.get(),
  width: category$.width.get(),
  left: category$.left.get(),
  setIndex,
  setWidth,
  setLeft,
});

export default NavState;
