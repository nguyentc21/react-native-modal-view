import React, { useMemo } from 'react';

import SliderModalView from './SliderModalView';
import FadeModalView from './FadeModalView';

import { useDimensionContext } from '../../contexts/DimensionContext';
import { generateModalItemProps } from '../../functions';

import type { NestedModalProps } from '../../types';

function ModalItem(props: NestedModalProps) {
  const {
    visible,
    extraData,
    keyboardHeight,
    onClose,
    blurToClose,
    bottomOffset,
    autoPadding,
    modalType,
    autoTransform,
    transformBreakPoint,
  } = props;

  const dimension = useDimensionContext();

  const modalProps = useMemo(() => {
    return {
      dimension,
      ...generateModalItemProps(props, dimension.width),
    };
  }, [
    dimension.width,
    dimension.height,
    extraData,
    transformBreakPoint,
    modalType,
    autoTransform,
  ]);

  if (modalProps.modalType === 'slide') {
    return (
      <SliderModalView
        {...modalProps}
        keyboardHeight={keyboardHeight}
        blurToClose={blurToClose}
        bottomOffset={bottomOffset}
        autoPadding={autoPadding}
        visible={visible}
        onClose={onClose}
      />
    );
  }
  return (
    <FadeModalView
      {...modalProps}
      keyboardHeight={keyboardHeight}
      blurToClose={blurToClose}
      bottomOffset={bottomOffset}
      autoPadding={autoPadding}
      visible={visible}
      onClose={onClose}
    />
  );
}

export default ModalItem;
