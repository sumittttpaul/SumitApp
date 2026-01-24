import { observable } from "@legendapp/state";

const insetState$ = observable({ top: 0, bottom: 0 });

const setTopInsetValue = (value: number) => insetState$.assign({ top: value });
const setBottomInsetValue = (value: number) => insetState$.assign({ bottom: value });

const SafeAreaInsetState = () => ({
  topInset: insetState$.top.get(),
  bottomInset: insetState$.bottom.get(),
  setTopInsetValue,
  setBottomInsetValue,
});

export default SafeAreaInsetState;
