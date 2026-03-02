import { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import useStableCallback from '../../../hooks/utils/useStableCallback';
import { DEFAULT_ANIMATION_IN_DURATION } from '../../../constants';

const DEFAULT_FADE_IN_ANIMATION_CONFIG = {
  duration: DEFAULT_ANIMATION_IN_DURATION,
  useNativeDriver: true,
};
const DEFAULT_FADE_OUT_ANIMATION_CONFIG = {
  duration: DEFAULT_ANIMATION_IN_DURATION * 0.75,
  useNativeDriver: true,
};

const DEFAULT_SLIDE_IN_ANIMATION_CONFIG = {
  duration: DEFAULT_ANIMATION_IN_DURATION,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
};
const DEFAULT_SLIDE_OUT_ANIMATION_CONFIG = {
  duration: DEFAULT_ANIMATION_IN_DURATION * 0.75,
  easing: Easing.in(Easing.cubic),
  useNativeDriver: true,
};

type UseControllerParams = {
  onOpen?(): void;
  onDidOpen?(): void;
  onClose?(): void;
  onDidClose?(): void;
  onStop?(): void;
  visible: boolean | undefined;
  contentHeight: number;
  maxHeight: number;
};

const useController = (params: UseControllerParams) => {
  const {
    onOpen,
    onDidOpen,
    onClose,
    onDidClose,
    onStop,
    visible,
    contentHeight,
    maxHeight,
  } = params;

  const hasOpenedRef = useRef(false);

  const [opacityAnimated] = useState(() => new Animated.Value(0));
  const [translateYAnimated] = useState(
    () => new Animated.Value(contentHeight || maxHeight),
  );
  const [visibleState, setVisibleState] = useState(false);

  const open = useStableCallback(() => {
    setVisibleState(true);
    onOpen?.();
    Animated.timing(opacityAnimated, {
      ...DEFAULT_FADE_IN_ANIMATION_CONFIG,
      toValue: 1,
    }).start();
    Animated.timing(translateYAnimated, {
      ...DEFAULT_SLIDE_IN_ANIMATION_CONFIG,
      toValue: 0,
    }).start(({ finished }) => {
      if (finished) onDidOpen?.();
    });
  });

  const close = useStableCallback(() => {
    onClose?.();
    Animated.timing(translateYAnimated, {
      ...DEFAULT_SLIDE_OUT_ANIMATION_CONFIG,
      toValue: contentHeight,
    }).start();
    Animated.timing(opacityAnimated, {
      ...DEFAULT_FADE_OUT_ANIMATION_CONFIG,
      toValue: 0,
    }).start(({ finished }) => {
      if (finished) {
        setVisibleState(false);
        onDidClose?.();
      }
    });
  });

  const stop = useStableCallback(() => {
    opacityAnimated?.stopAnimation?.();
    translateYAnimated?.stopAnimation?.();
    onStop?.();
  });

  useEffect(() => {
    if (visible) {
      hasOpenedRef.current = true;
      open();
    } else {
      // chỉ close nếu đã từng mở
      if (hasOpenedRef.current) close();
    }
    return () => {
      stop();
    };
  }, [visible]);

  return {
    animatedStyles: { opacity: opacityAnimated },
    animatedContentStyles: {
      transform: [{ translateY: translateYAnimated }],
    },
    modalVisible: visibleState,
  };
};

export default useController;
