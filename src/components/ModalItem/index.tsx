import React, { useMemo, useEffect } from 'react';

import SliderModalView from './SliderModalView';
import FadeModalView from './FadeModalView';

import { useDimensionContext } from '../../contexts/DimensionContext';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { generateModalItemProps } from '../../functions';

import type { NestedModalProps } from '../../types';

function ModalItem(props: NestedModalProps) {
  const {
    modalType,
    autoTransform,
    transformBreakPoint,
    getLayoutData,
    keyboardHeight,
    safeAreaInsets,
    dimension,
    extraData,
    ...modalItemProps
  } = props;
  const { contentContainerStyle } = modalItemProps;

  const dimensionContext = useDimensionContext();
  const {
    keyboardHeight: keyboardHeightContextValue,
    safeAreaInsets: safeAreaInsetsContextValue,
  } = useLayoutContext();
  const _keyboardHeight = keyboardHeight ?? keyboardHeightContextValue;
  const _safeAreaInsets = safeAreaInsets ?? safeAreaInsetsContextValue;
  const _dimension = dimension ?? dimensionContext;

  const {
    contentContainerStyle: nContentContainerStyle,
    modalType: nModalType,
  } = useMemo(() => {
    return generateModalItemProps(
      {
        autoTransform,
        modalType,
        transformBreakPoint,
      },
      _dimension.width,
    );
  }, [autoTransform, modalType, transformBreakPoint, _dimension.width]);

  useEffect(() => {
    if (!getLayoutData) return;
    getLayoutData({
      keyboardHeight: _keyboardHeight,
      safeAreaInsets: _safeAreaInsets,
      dimension: _dimension,
    });
  }, [getLayoutData, _dimension, _keyboardHeight, _safeAreaInsets]);

  if (nModalType === 'slide') {
    return (
      <SliderModalView
        {...modalItemProps}
        contentContainerStyle={[contentContainerStyle, nContentContainerStyle]}
        keyboardHeight={_keyboardHeight}
        dimension={_dimension}
        safeAreaInsets={_safeAreaInsets}
      />
    );
  }
  return (
    <FadeModalView
      {...modalItemProps}
      contentContainerStyle={[contentContainerStyle, nContentContainerStyle]}
      keyboardHeight={_keyboardHeight}
      dimension={_dimension}
      safeAreaInsets={_safeAreaInsets}
    />
  );
}

export default ModalItem;
