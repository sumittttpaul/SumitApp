// Temporary disabling some typescript eslint rules which can be off in eslint config file as well.
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import type { Observable } from "@legendapp/state";
import { observable } from "@legendapp/state";

type Props = {
  ref?: React.RefObject<GorhomBottomSheet | null>;
};

type SheetStore<T extends object> = {
  state$: Observable<Props & T>;
  set: (v: Partial<Props & T>) => void;
  open: () => void;
  close: () => void;
};

type BottomSheetStateReturn = {
  exampleBottomSheet: Observable<Props & { selectedItem?: string }>;
  setExampleBottomSheet: (v: Partial<Props & { selectedItem?: string }>) => void;
  openExampleBottomSheet: () => void;
  closeExampleBottomSheet: () => void;
};

function makeSheetStore<T extends object = {}>(extra: T = {} as T): SheetStore<T> {
  const initialState = {
    ref: { current: null } as React.RefObject<GorhomBottomSheet | null>,
    ...extra,
  } as Props & T;

  const state$ = observable(initialState);
  const typedState$ = state$ as Observable<Props & T>;

  const set = (v: Partial<Props & T>) => {
    (typedState$ as any).assign(v);
  };

  const open = () => {
    const currentState = typedState$.get();
    currentState.ref?.current?.expand();
  };

  const close = () => {
    const currentState = typedState$.get();
    currentState.ref?.current?.close();
  };

  return { state$: typedState$, set, open, close };
}

const {
  state$: ExampleBottomSheetState$,
  set: setExampleBottomSheet,
  open: openExampleBottomSheet,
  close: closeExampleBottomSheet,
} = makeSheetStore<{ selectedItem?: string }>({ selectedItem: "" });

export default function BottomSheetState(): BottomSheetStateReturn {
  return {
    exampleBottomSheet: ExampleBottomSheetState$,
    setExampleBottomSheet,
    openExampleBottomSheet,
    closeExampleBottomSheet,
  };
}
