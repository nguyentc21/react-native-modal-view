import { useMemo } from 'react';

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

  return useMemo(() => {
    return {
      containerStyles: [
        {
          maxHeight,
          marginTop:
            autoPadding && safeAreaInsets.top ? safeAreaInsets.top + 8 : 10,
        },
        autoPadding && {
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
        autoPadding && !!keyboardHeight && { paddingBottom: keyboardHeight },
      ],
    };
  }, [
    maxHeight,
    keyboardHeight,
    autoPadding,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
  ]);
};

export default useStyles;
