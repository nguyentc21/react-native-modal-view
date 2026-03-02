import React, { useMemo } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';

import ModalItem from './components/ModalItem';
import useController from './hooks/useController';
import LayoutContext, {
  defaultLayoutContextValue,
} from './contexts/LayoutContext';
import DimensionContext from './contexts/DimensionContext';

import type { ModalSectionProps } from './types';

function ModalSection(props: ModalSectionProps) {
  const { enable, keyboardHeight, safeAreaInsets, dimension } = props;

  const windowDimension = useWindowDimensions();
  const modalItemList = useController(props);

  const contextValue = useMemo(
    () => ({
      keyboardHeight:
        keyboardHeight ?? defaultLayoutContextValue.keyboardHeight,
      safeAreaInsets: safeAreaInsets ?? {
        ...defaultLayoutContextValue.safeAreaInsets,
      },
    }),
    [keyboardHeight, safeAreaInsets],
  );
  const dimensionContextValue = useMemo(() => {
    return dimension ?? windowDimension;
  }, [dimension, windowDimension]);

  if (!enable || modalItemList == undefined || modalItemList.length < 1)
    return null;

  return (
    <LayoutContext.Provider value={contextValue}>
      <DimensionContext.Provider value={dimensionContextValue}>
        <View style={[StyleSheet.absoluteFill]}>
          {modalItemList.map((item) => (
            <ModalItem key={item.id} {...item} />
          ))}
        </View>
      </DimensionContext.Provider>
    </LayoutContext.Provider>
  );
}

export default ModalSection;
