import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

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

type UseControllerParams = {
  onOpen?(): void;
  onDidOpen?(): void;
  onClose?(): void;
  onDidClose?(): void;
  onStop?(): void;
  visible: boolean | undefined;
};

const useController = (params: UseControllerParams) => {
  const { onOpen, onDidOpen, onClose, onDidClose, onStop, visible } = params;

  const hasOpenedRef = useRef(false);

  const [opacityAnimated] = useState(() => new Animated.Value(0));
  const [visibleState, setVisibleState] = useState(false);

  const open = useStableCallback(() => {
    setVisibleState(true);
    onOpen?.();
    Animated.timing(opacityAnimated, {
      ...DEFAULT_FADE_IN_ANIMATION_CONFIG,
      toValue: 1,
    }).start(({ finished }) => {
      if (finished) onDidOpen?.();
    });
  });

  const close = useStableCallback(() => {
    onClose?.();
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
    modalVisible: visibleState,
  };
};

export default useController;
