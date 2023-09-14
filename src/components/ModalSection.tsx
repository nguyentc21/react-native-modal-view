import React, { useState, useEffect, memo } from 'react';
import { View } from 'react-native';

import ModalView from './ModalView';
import SliderModalView from './SliderModalView';

import EventRegister from './EvenRegister';
import styles from '../styles';

import type { NestedModalProps } from '../types';

const MainModal = memo<{ visible: boolean }>((props) => {
  const [modalListState, setModalListState] = useState<NestedModalProps[]>([]);

  // Did mount && will unmount
  useEffect(() => {
    EventRegister.on('open-nested-modal', (modalProps: NestedModalProps) => {
      setModalListState((_state) => {
        _state.push(modalProps);
        return _state;
      });
    });
    EventRegister.on('close-nested-modal', (args: { id: string }) => {
      setModalListState((_state) => {
        return _state.map((el) => {
          if (el.id === args.id) {
            return { ...el, visible: false };
          }
          return el;
        });
      });
    });
    EventRegister.on('update-nested-modal', (modalProps: NestedModalProps) => {
      setModalListState((_state) => {
        return _state.map((el) => {
          if (el.id === modalProps.id) {
            return modalProps;
          }
          return el;
        });
      });
    });
    return () => {
      EventRegister.rm('open-nested-modal');
      EventRegister.rm('close-nested-modal');
      EventRegister.rm('update-nested-modal');
    };
  }, []);

  const _onCloseModal = (modalProps: NestedModalProps) => () => {
    modalProps.onClose && modalProps.onClose();
    setModalListState((_state) =>
      _state.filter((item) => item.id !== modalProps.id)
    );
  };

  if (!props.visible || !modalListState || modalListState.length < 1)
    return null;

  return (
    <View style={styles.modalWrapContainer}>
      {modalListState.map((item) => {
        const { id, modalType, ..._modalProps } = item;
        if (modalType === 'slide') {
          return (
            <SliderModalView
              key={id}
              {..._modalProps}
              onClose={_onCloseModal(item)}
            />
          );
        }
        return (
          <ModalView
            key={id}
            maxHeight={'80%'}
            {..._modalProps}
            onClose={_onCloseModal(item)}
          />
        );
      })}
    </View>
  );
});

export default MainModal;
