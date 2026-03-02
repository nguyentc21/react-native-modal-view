import { createContext, useContext } from 'react';
import type { SafeAreaInsets } from '../types';

const DEFAULT_KEYBOARD_HEIGHT = 0;
const DEFAULT_SAFE_AREA_INSETS = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const defaultLayoutContextValue = {
  keyboardHeight: DEFAULT_KEYBOARD_HEIGHT,
  safeAreaInsets: { ...DEFAULT_SAFE_AREA_INSETS },
};

const LayoutContext = createContext<{
  keyboardHeight: number;
  safeAreaInsets: SafeAreaInsets;
}>(defaultLayoutContextValue);

const useLayoutContext = () => {
  return useContext(LayoutContext);
};

export { defaultLayoutContextValue, useLayoutContext };
export default LayoutContext;
