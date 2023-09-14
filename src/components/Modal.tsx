import React from 'react';

import ModalView from './ModalView';
import SliderModalView from './SliderModalView';

import type { ModalViewProps, ModalType } from '../types';

const Modal = (props: ModalViewProps & { modalType?: ModalType }) => {
  const { modalType = 'fade' } = props;
  if (modalType === 'slide') {
    return <SliderModalView {...props} />;
  }
  return <ModalView {...props} />;
};

export default Modal;
