import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-ntc-pressable';

import { generateId } from '../functions';
import styles from '../styles';

import type { LayoutChangeEvent } from 'react-native';
import type { ModalViewProps } from '../types';

const ANIMATION_DURATION = 200;
const DEFAULT_HEIGHT_RATIO = 0.7;

const ModalView = (props: ModalViewProps) => {
  const {
    containerStyle,
    wrapContainerStyle,
    backdropStyle,
    id,
    visible,
    close,
    onOpen,
    onDidOpen,
    onClose,
    maxHeight,
    keyboardHeight,
    safeAreaInsets,
    onMainContentLayout,
    blurToClose = true,
    children,
    wrapContent,
    bottomOffset,
  } = props;

  const localData = useRef({
    isRunningAnimation: false,
    id: id || generateId(),
  });

  const [backdropOpacityState] = useState(new Animated.Value(0));
  const [visibleState, setVisibleState] = useState(false);

  const { height } = useWindowDimensions();
  const _maxHeight = maxHeight ? maxHeight : height * DEFAULT_HEIGHT_RATIO;
  const _bottomOffset = bottomOffset ?? height * 0.15;
  const _marginBottom =
    !keyboardHeight || keyboardHeight + 10 < _bottomOffset
      ? _bottomOffset
      : keyboardHeight + 10;

  useEffect(() => {
    if (visible) {
      if (localData.current.isRunningAnimation) {
        _dropAnimation();
        setTimeout(() => {
          _openModal();
        }, 100);
      } else {
        _openModal();
      }
    } else {
      if (localData.current.isRunningAnimation) {
        _dropAnimation();
        setTimeout(() => {
          _closeModal();
        }, 100);
      } else {
        _closeModal();
      }
    }
  }, [visible]);

  const _openModal = (): void => {
    setVisibleState(true);
    onOpen?.(localData.current.id);
    localData.current.isRunningAnimation = true;
    Animated.timing(backdropOpacityState, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      localData.current.isRunningAnimation = false;
      onDidOpen?.(localData.current.id);
    });
  };
  const _closeModal = (): void => {
    localData.current.isRunningAnimation = true;
    Animated.timing(backdropOpacityState, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      delay: 0,
      useNativeDriver: true,
    }).start(() => {
      setVisibleState(false);
      localData.current.isRunningAnimation = false;
      onClose?.(localData.current.id);
    });
  };

  const _dropAnimation = (): void => {
    // @ts-ignore
    Animated.timing(backdropOpacityState).stop();
  };

  const _onBackdropPress = () => {
    close?.();
  };

  const _onModalContentLayout = onMainContentLayout
    ? (e: LayoutChangeEvent): void => {
        e.persist();
        onMainContentLayout(e, localData.current.id);
      }
    : undefined;

  if (!visibleState) return null;

  return (
    <Animated.View
      style={[
        styles.modalWrapContainer,
        { opacity: backdropOpacityState },
        wrapContainerStyle,
      ]}>
      <TouchableWithoutFeedback
        onPress={_onBackdropPress}
        disabled={!blurToClose}>
        <View
          style={[
            {
              height: '100%',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
            backdropStyle,
          ]}
        />
      </TouchableWithoutFeedback>
      <View
        style={[
          {
            backgroundColor: '#ffffff',
            marginTop: 'auto',
            marginBottom: _marginBottom,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 20,
            overflow: 'hidden',
            maxHeight: _maxHeight,
            flexShrink: 1,
          },
          !!safeAreaInsets &&
            !!keyboardHeight && {
              top: safeAreaInsets.top,
              marginBottom: _marginBottom + safeAreaInsets.top,
            },
          containerStyle,
        ]}
        onLayout={_onModalContentLayout}>
        {children}
      </View>
      {wrapContent}
    </Animated.View>
  );
};

export default ModalView;
