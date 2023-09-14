import { useEffect, useRef } from 'react';

import EventRegister from './EvenRegister';
import { generateId } from '../functions';

import type { NestedModalProps } from '../types';

const StaticNestedModal = (
  props: Omit<NestedModalProps, 'id'> & {
    id?: NestedModalProps['id'];
    updateKey?: number | string;
  }
) => {
  const myModalIdRef = useRef(generateId()).current;

  useEffect(() => {
    return () => {
      EventRegister.emit('close-nested-modal', {
        id: myModalIdRef,
      });
    };
  }, []);

  useEffect(() => {
    if (props.visible) {
      EventRegister.emit('open-nested-modal', {
        id: myModalIdRef,
        ...props,
      });
    } else {
      EventRegister.emit('close-nested-modal', {
        id: myModalIdRef,
      });
    }
  }, [props.visible]);

  useEffect(() => {
    if (props.updateKey) {
      _refreshModalContent();
    }
  }, [props.updateKey]);

  const _refreshModalContent = () => {
    EventRegister.emit('update-nested-modal', {
      id: myModalIdRef,
      ...props,
    });
  };

  return null;
};

export default StaticNestedModal;