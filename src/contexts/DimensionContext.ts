import { createContext, useContext } from 'react';

const DEFAULT_DIMENSION_DATA = {
  width: 0,
  height: 0,
};

const DimensionContext = createContext<{
  width: number;
  height: number;
}>(DEFAULT_DIMENSION_DATA);

const useDimensionContext = () => {
  return useContext(DimensionContext);
};

export { DEFAULT_DIMENSION_DATA, useDimensionContext };
export default DimensionContext;
