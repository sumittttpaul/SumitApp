import { useObservable, useSelector } from "@legendapp/state/react";
import type { Observable, Selector } from "@legendapp/state";

export function useStateX<S>(initialState: S | (() => S)): [{ peek: S; get: () => S }, React.Dispatch<React.SetStateAction<S>>] {
  const observable = useObservable(initialState) as Observable<S | (() => S)> & { set: React.Dispatch<React.SetStateAction<S>> };
  const snapshot = useSelector(observable as Selector<S>);
  const getValue = () => observable.get() as S;
  const setValue = (newValue: React.SetStateAction<S>) => observable.set(newValue);

  const state = {
    peek: snapshot, // For UI → reactive
    get: getValue, // For logic → fresh read
  } as const;

  return [state, setValue] as const;
}
