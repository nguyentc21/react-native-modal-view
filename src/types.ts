import type { LayoutChangeEvent, ViewStyle, ViewProps } from 'react-native';
import type { ReactNode } from 'react';

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Dimension = {
  width: number;
  height: number;
};

type ModalViewProps = {
  wrapContainerStyle?: ViewProps['style'];
  backdropStyle?: ViewProps['style'];
  containerStyle?: ViewProps['style'];
  style?: ViewProps['style'];
  contentContainerStyle?: ViewProps['style'];
  id: string;
  visible: boolean;
  close?(): void;
  blurToClose?: boolean;
  maxHeight?: ViewStyle['maxHeight'];
  keyboardHeight: number;
  safeAreaInsets: SafeAreaInsets;
  onOpen?(): void;
  onDidOpen?(): void;
  onClose?(): void;
  onMainContentLayout?(e: LayoutChangeEvent): void;
  onContainerLayout?(e: LayoutChangeEvent): void;
  children?: ReactNode;
  additionContent?: ReactNode;
  bottomOffset?: number;
  dimension: Dimension;
  autoPadding?: boolean;
};

type LayoutData = {
  keyboardHeight: number;
  safeAreaInsets: SafeAreaInsets;
  dimension: Dimension;
};
type ModalType = 'fade' | 'slide';
type NestedModalProps = Omit<
  ModalViewProps,
  'dimension' | 'keyboardHeight' | 'safeAreaInsets'
> & {
  modalType?: ModalType;
  autoTransform?: boolean;
  transformBreakPoint?: number;
  extraData?: unknown;
  dimension?: Dimension;
  keyboardHeight?: number;
  safeAreaInsets?: SafeAreaInsets;
  getLayoutData?(data: LayoutData): void;
};

type ModalSectionProps = {
  enable: boolean;
  keyboardHeight?: number;
  safeAreaInsets?: SafeAreaInsets;
  defaultModalProps?: Partial<NestedModalProps>;
  dimension?: Dimension;
};

type ModalItemProps = ModalViewProps &
  Pick<NestedModalProps, 'modalType'> &
  Pick<ModalSectionProps, 'defaultModalProps'>;

export type {
  SafeAreaInsets,
  ModalViewProps,
  ModalType,
  NestedModalProps,
  ModalSectionProps,
  ModalItemProps,
};
