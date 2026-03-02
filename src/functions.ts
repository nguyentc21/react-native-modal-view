import { DEFAULT_MODAL_WIDTH_BREAKPOINT } from './constants';

import type { ViewProps } from 'react-native';
import type { NestedModalProps } from './types';

const getAutoTransformModalType = (
  autoTransform: boolean,
  modalType: NestedModalProps['modalType'],
  width: number,
  breakPoint?: number,
) => {
  const _breakPoint =
    breakPoint == undefined ? DEFAULT_MODAL_WIDTH_BREAKPOINT : breakPoint;
  return !!autoTransform && width > _breakPoint ? 'fade' : modalType;
};

const getAutoTransformWidth = (width: number, breakPoint?: number) => {
  const _breakPoint =
    breakPoint == undefined ? DEFAULT_MODAL_WIDTH_BREAKPOINT : breakPoint;
  return width > _breakPoint * 1.1 ? _breakPoint : width * 0.9;
};

const generateModalItemProps = <
  T extends Pick<
    NestedModalProps,
    | 'contentContainerStyle'
    | 'autoTransform'
    | 'modalType'
    | 'transformBreakPoint'
  >,
>(
  nestedModalProps: T,
  contentWidth: number,
): T => {
  const {
    contentContainerStyle,
    autoTransform,
    modalType,
    transformBreakPoint,
  } = nestedModalProps;
  const _modalType = getAutoTransformModalType(
    !!autoTransform,
    modalType,
    contentWidth,
    transformBreakPoint,
  );
  const _modalContentStyles: ViewProps['style'] | undefined =
    !!autoTransform && _modalType === 'fade'
      ? {
          width: getAutoTransformWidth(contentWidth, transformBreakPoint),
        }
      : undefined;
  return {
    ...nestedModalProps,
    modalType: _modalType,
    contentContainerStyle: [contentContainerStyle, _modalContentStyles],
  };
};

export { generateModalItemProps };
