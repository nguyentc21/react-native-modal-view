import { useMemo } from 'react';

import { useLayoutContext } from '../../../contexts/LayoutContext';

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

  const {
    keyboardHeight: keyboardHeightContextValue,
    safeAreaInsets: safeAreaInsetsContextValue,
  } = useLayoutContext();
  const _keyboardHeight = keyboardHeight ?? keyboardHeightContextValue;
  const _safeAreaInsets = safeAreaInsets ?? safeAreaInsetsContextValue;

  return useMemo(() => {
    const defaultBottomOffset =
      !autoPadding || height * 0.15 >= _safeAreaInsets.bottom
        ? height * 0.15
        : _safeAreaInsets.bottom;
    const defaultMaxHeight = height * DEFAULT_HEIGHT_RATIO;
    const _maxHeight = maxHeight ?? defaultMaxHeight;
    const _bottomOffset = bottomOffset ?? defaultBottomOffset;
    const _marginBottom =
      !autoPadding || !_keyboardHeight || _keyboardHeight + 10 < _bottomOffset
        ? _bottomOffset
        : _keyboardHeight + 10;
    let _width = width * 0.9;
    const maxWidth =
      (width - _safeAreaInsets.left - _safeAreaInsets.right) * 0.96;
    if (autoPadding && _width > maxWidth) _width = maxWidth;
    return {
      containerStyles: {
        maxHeight: _maxHeight,
        paddingTop: _safeAreaInsets.top || 10,
        marginBottom: _marginBottom,
        width: _width,
      },
    };
  }, [
    _keyboardHeight,
    _safeAreaInsets,
    bottomOffset,
    height,
    autoPadding,
    maxHeight,
    width,
  ]);
};

export default useStyles;
