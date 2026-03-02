import { useEffect, useRef } from 'react';

import EventRegister from './services/EvenRegister';
import { generateId } from './helpers';

import type { NestedModalProps } from './types';

const useNestedModal = (props: Omit<NestedModalProps, 'id'>) => {
  const { visible, extraData } = props;

  const myModalIdRef = useRef<string>();
  if (!myModalIdRef.current) {
    myModalIdRef.current = generateId();
  }

  useEffect(() => {
    if (visible) {
      EventRegister.emit('open-nested-modal', {
        id: myModalIdRef.current,
        ...props,
      });
    } else {
      EventRegister.emit('close-nested-modal', myModalIdRef.current);
    }
  }, [visible]);

  useEffect(() => {
    EventRegister.emit('update-nested-modal', {
      id: myModalIdRef.current,
      ...props,
    });
  }, [extraData]);

  useEffect(() => {
    return () => {
      EventRegister.emit('close-nested-modal', myModalIdRef.current);
    };
  }, []);
};

function NestedModal(props: Omit<NestedModalProps, 'id'>) {
  useNestedModal(props);
  return null;
}

export { useNestedModal };
export default NestedModal;
