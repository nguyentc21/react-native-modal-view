import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';

import ModalView from './ModalView';
import SliderModalView from './SliderModalView';

import EventRegister from './EvenRegister';
import { getAutoTransformWidth, getAutoTransformModalType } from '../functions';
import styles from '../styles';

import type { StyleProp, ViewStyle } from 'react-native';
import type { NestedModalProps } from '../types';

const MainModal = (props: {
  visible?: boolean;
  wrapStyle?: StyleProp<ViewStyle>;
  defaultModalProps?: Partial<NestedModalProps>;
}) => {
  const { visible = true, wrapStyle, defaultModalProps } = props;
  const { width, height } = useWindowDimensions();
  const {
    containerStyle: defaultContainerStyle,
    wrapContainerStyle: defaultWrapContainerStyle,
    backdropStyle: defaultBackdropStyle,
    ..._defaultModalProps
  } = defaultModalProps || {};
  const [modalListState, setModalListState] = useState<NestedModalProps[]>([]);

  useEffect(() => {
    EventRegister.on('open-nested-modal', (modalProps: NestedModalProps) => {
      setModalListState((_state) => {
        return _state.concat(modalProps);
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
    modalProps.onClose?.();
    setModalListState((_state) =>
      _state.filter((item) => item.id !== modalProps.id),
    );
  };

  if (!visible || modalListState == undefined || modalListState.length < 1)
    return null;

  return (
    <View style={[styles.modalWrapContainer, wrapStyle]}>
      {modalListState.map((item) => {
        const {
          id,
          modalType,
          containerStyle,
          wrapContainerStyle,
          backdropStyle,
          autoTransform,
          transformBreakPoint,
          ..._modalProps
        } = item;
        const _modalType = getAutoTransformModalType(
          !!autoTransform,
          modalType,
          width,
          transformBreakPoint,
        );
        const _modalContentStyles: ViewStyle | undefined =
          !!autoTransform && _modalType === 'fade'
            ? {
                width: getAutoTransformWidth(width, transformBreakPoint),
                marginTop: 'auto',
                marginBottom: height * 0.1,
              }
            : undefined;
        if (_modalType === 'slide') {
          return (
            <SliderModalView
              key={id}
              containerStyle={[defaultContainerStyle, containerStyle]}
              wrapContainerStyle={[
                defaultWrapContainerStyle,
                wrapContainerStyle,
              ]}
              backdropStyle={[defaultBackdropStyle, backdropStyle]}
              {..._defaultModalProps}
              {..._modalProps}
              onClose={_onCloseModal(item)}
            />
          );
        }
        return (
          <ModalView
            key={id}
            maxHeight={'80%'}
            containerStyle={[
              defaultContainerStyle,
              _modalContentStyles,
              containerStyle,
            ]}
            wrapContainerStyle={[defaultWrapContainerStyle, wrapContainerStyle]}
            backdropStyle={[defaultBackdropStyle, backdropStyle]}
            {..._defaultModalProps}
            {..._modalProps}
            onClose={_onCloseModal(item)}
          />
        );
      })}
    </View>
  );
};

export default MainModal;
