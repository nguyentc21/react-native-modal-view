import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-ntc-pressable';

import { generateId } from '../functions';
import styles from '../styles';

import type { LayoutChangeEvent } from 'react-native';
import type { ModalViewProps } from '../types';

const ANIMATION_BOUNCINESS = 1;
const ANIMATION_SPEED = 15;
const ANIMATION_DURATION = 200;

const SliderModal = (props: ModalViewProps) => {
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
    onMainContentLayout,
    children,
    wrapContent,
    keyboardHeight,
    safeAreaInsets,
    blurToClose = true,
    maxHeight = '90%',
  } = props;

  const myLocalData = useRef({
    isRunningAnimation: false,
    id: id || generateId(),
  });

  const { height } = useWindowDimensions();

  const [state] = useState({
    backdropOpacity: new Animated.Value(0),
    contentTranslateY: new Animated.Value(height),
  });
  const [contentLayout, setContentLayout] = useState({ height });
  const [visibleState, setVisibleState] = useState(false);

  useEffect(() => {
    if (visible) {
      if (myLocalData.current.isRunningAnimation) {
        _dropAnimation();
        setTimeout(() => {
          _openModal();
        }, 100);
      } else {
        _openModal();
      }
    } else {
      if (myLocalData.current.isRunningAnimation) {
        _dropAnimation();
        setTimeout(() => {
          _closeModal();
        }, 100);
      } else {
        _closeModal();
      }
    }
  }, [visible]);

  const _openModal = () => {
    setVisibleState(true);
    onOpen?.(id);
    myLocalData.current.isRunningAnimation = true;
    Animated.timing(state.backdropOpacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
    Animated.spring(state.contentTranslateY, {
      toValue: 0,
      speed: ANIMATION_SPEED,
      bounciness: ANIMATION_BOUNCINESS,
      useNativeDriver: true,
    }).start(() => {
      myLocalData.current.isRunningAnimation = false;
      onDidOpen?.(id);
    });
  };
  const _closeModal = () => {
    myLocalData.current.isRunningAnimation = true;
    Animated.spring(state.contentTranslateY, {
      toValue: contentLayout.height,
      speed: ANIMATION_SPEED,
      bounciness: ANIMATION_BOUNCINESS,
      useNativeDriver: true,
    }).start();
    Animated.timing(state.backdropOpacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      delay: 0,
      useNativeDriver: true,
    }).start(() => {
      setVisibleState(false);
      myLocalData.current.isRunningAnimation = false;
      onClose?.(id);
    });
  };

  const _dropAnimation = () => {
    // @ts-ignore
    Animated.timing(state.backdropOpacity).stop();
    // @ts-ignore
    Animated.spring(state.contentTranslateY).stop();
  };

  const _onBackdropPress = () => {
    close?.();
  };

  const _onModalContentLayout = (e: LayoutChangeEvent) => {
    e.persist();
    onMainContentLayout?.(e, id);
    const layout = e.nativeEvent?.layout;
    setContentLayout(layout);
  };

  if (!visibleState) return null;

  return (
    <Animated.View
      style={[
        styles.modalWrapContainer,
        {
          opacity: state.backdropOpacity,
          justifyContent: 'flex-end',
        },
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
              top: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
            backdropStyle,
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          {
            backgroundColor: '#ffffff',
            width: '100%',
            maxHeight,
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            flexShrink: 1,
            transform: [{ translateY: state.contentTranslateY }],
          },
          !!safeAreaInsets && {
            marginTop: safeAreaInsets.top,
            paddingBottom: safeAreaInsets.bottom,
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
          },
          containerStyle,
          !!keyboardHeight && { paddingBottom: keyboardHeight },
        ]}
        onLayout={_onModalContentLayout}>
        {children}
      </Animated.View>
      {wrapContent}
    </Animated.View>
  );
};

export default SliderModal;
