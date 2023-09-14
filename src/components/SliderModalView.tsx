import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    edges,
    children,
    wrapContent,
    blurToClose = true,
    maxHeight = '90%',
  } = props;

  const myLocalData = useRef({
    isRunningAnimation: false,
    id: id || generateId(),
  });

  const { height } = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();

  const [state] = useState({
    backdropOpacity: new Animated.Value(0),
    contentTranslateY: new Animated.Value(height),
  });
  const [contentLayout, setContentLayout] = useState({ height });
  const [visibleState, setVisibleState] = useState(false);

  const safeViewStyle = useMemo(() => {
    return edges?.map((i) => {
      switch (i) {
        case 'top':
          return { paddingTop: safeAreaInsets.top };
        case 'bottom':
          return { paddingBottom: safeAreaInsets.bottom };
        case 'left':
          return { paddingLeft: safeAreaInsets.left };
        case 'right':
          return { paddingRight: safeAreaInsets.right };
      }
    });
  }, [edges, safeAreaInsets]);

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
      ]}
    >
      <TouchableWithoutFeedback
        onPress={_onBackdropPress}
        disabled={!blurToClose}
      >
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
            backgroundColor: '#fff',
            width: '100%',
            maxHeight,
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY: state.contentTranslateY }],
          },
          safeViewStyle,
          containerStyle,
        ]}
        onLayout={_onModalContentLayout}
      >
        {children}
      </Animated.View>
      {wrapContent}
    </Animated.View>
  );
};

export default SliderModal;