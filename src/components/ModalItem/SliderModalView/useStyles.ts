import { useMemo } from 'react';

import { useLayoutContext } from '../../../contexts/LayoutContext';

import type { ViewProps } from 'react-native';
import type { ModalViewProps } from '../../../types';

type UseStylesParams = Pick<
  ModalViewProps,
  'maxHeight' | 'keyboardHeight' | 'safeAreaInsets' | 'autoPadding'
>;
const useStyles = (
  props: UseStylesParams,
): {
  containerStyles?: ViewProps['style'];
  contentContainerStyles?: ViewProps['style'];
} => {
  const { maxHeight, keyboardHeight, safeAreaInsets, autoPadding } = props;

  const {
    keyboardHeight: keyboardHeightContextValue,
    safeAreaInsets: safeAreaInsetsContextValue,
  } = useLayoutContext();
  const _keyboardHeight = keyboardHeight ?? keyboardHeightContextValue;
  const _safeAreaInsets = safeAreaInsets ?? safeAreaInsetsContextValue;

  return useMemo(() => {
    return {
      containerStyles: [
        {
          maxHeight,
          marginTop:
            autoPadding && _safeAreaInsets.top ? _safeAreaInsets.top + 8 : 10,
        },
        autoPadding && {
          paddingBottom: _safeAreaInsets.bottom,
          paddingLeft: _safeAreaInsets.left,
          paddingRight: _safeAreaInsets.right,
        },
        autoPadding && !!_keyboardHeight && { paddingBottom: _keyboardHeight },
      ],
    };
  }, [maxHeight, _safeAreaInsets, _keyboardHeight, autoPadding]);
};

export default useStyles;
