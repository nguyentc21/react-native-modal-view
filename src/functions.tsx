import type { NestedModalProps } from './types';

export const generateId = () => {
  return `${Date.now().valueOf()}_${Math.random()}`;
};

const DEFAULT_BREAK_POINT = 650;

export const getAutoTransformModalType = (
  autoTransform: boolean,
  modalType: NestedModalProps['modalType'],
  width: number,
  breakPoint?: number,
) => {
  const _breakPoint =
    breakPoint == undefined ? DEFAULT_BREAK_POINT : breakPoint;
  return !!autoTransform && width > _breakPoint ? 'fade' : modalType;
};

export const getAutoTransformWidth = (width: number, breakPoint?: number) => {
  const _breakPoint =
    breakPoint == undefined ? DEFAULT_BREAK_POINT : breakPoint;
  return width > _breakPoint * 1.1 ? _breakPoint : _breakPoint * 0.9;
};
