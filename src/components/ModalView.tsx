import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-ntc-pressable';

import { generateId } from '../functions';
import styles from '../styles';

import type { LayoutChangeEvent } from 'react-native';
import type { ModalViewProps } from '../types';

const ANIMATION_DURATION = 200;
const DEFAULT_HEIGHT_RATIO = 0.6;

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
    onMainContentLayout,
    blurToClose = true,
    edges,
    children,
    wrapContent,
  } = props;

  const localData = useRef({
    isRunningAnimation: false,
    id: id || generateId(),
  });

  const [backdropOpacityState] = useState(new Animated.Value(0));
  const [visibleState, setVisibleState] = useState(false);

  const { height } = useWindowDimensions();
  const _maxHeight = maxHeight ? maxHeight : height * DEFAULT_HEIGHT_RATIO;

  const safeAreaInsets = useSafeAreaInsets();
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

  const _onModalContentLayout = (e: LayoutChangeEvent): void => {
    e.persist();
    onMainContentLayout?.(e, localData.current.id);
  };

  if (!visibleState) return null;

  return (
    <Animated.View
      style={[
        styles.modalWrapContainer,
        { opacity: backdropOpacityState },
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
            backgroundColor: '#fff',
            marginTop: height * 0.1,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 20,
            overflow: 'hidden',
            maxHeight: _maxHeight,
          },
          safeViewStyle,
          containerStyle,
        ]}
        onLayout={_onModalContentLayout}
      >
        {children}
      </View>
      {wrapContent}
    </Animated.View>
  );
};

export default ModalView;
