import { useMemo } from 'react';

import type { ModalViewProps } from '../../../types';

const DEFAULT_HEIGHT_RATIO = 0.7;

type UseStylesParams = Pick<
  ModalViewProps,
  | 'maxHeight'
  | 'keyboardHeight'
  | 'safeAreaInsets'
  | 'bottomOffset'
  | 'dimension'
  | 'autoPadding'
>;
const useStyles = (props: UseStylesParams) => {
  const {
    maxHeight,
    keyboardHeight,
    safeAreaInsets,
    bottomOffset,
    dimension,
    autoPadding,
  } = props;

  const { width, height } = dimension;

  return useMemo(() => {
    const defaultBottomOffset =
      !autoPadding || height * 0.15 >= safeAreaInsets.bottom
        ? height * 0.15
        : safeAreaInsets.bottom;
    const defaultMaxHeight = height * DEFAULT_HEIGHT_RATIO;
    const _maxHeight = maxHeight ?? defaultMaxHeight;
    const _bottomOffset = bottomOffset ?? defaultBottomOffset;
    const _marginBottom =
      !autoPadding || !keyboardHeight || keyboardHeight + 10 < _bottomOffset
        ? _bottomOffset
        : keyboardHeight + 10;
    let _width = width * 0.9;
    const maxWidth =
      (width - safeAreaInsets.left - safeAreaInsets.right) * 0.96;
    if (autoPadding && _width > maxWidth) _width = maxWidth;
    return {
      containerStyles: {
        maxHeight: _maxHeight,
        paddingTop: safeAreaInsets.top || 10,
        marginBottom: _marginBottom,
        width: _width,
      },
    };
  }, [
    keyboardHeight,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
    bottomOffset,
    height,
    autoPadding,
    maxHeight,
    width,
  ]);
};

export default useStyles;
