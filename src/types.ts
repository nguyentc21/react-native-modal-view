import type { LayoutChangeEvent, ViewStyle, ViewProps } from 'react-native';
import type { ReactNode } from 'react';

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
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
  keyboardHeight?: number;
  safeAreaInsets?: SafeAreaInsets;
  onOpen?(): void;
  onDidOpen?(): void;
  onClose?(): void;
  onMainContentLayout?(e: LayoutChangeEvent): void;
  children?: ReactNode;
  additionContent?: ReactNode;
  bottomOffset?: number;
  dimension: {
    width: number;
    height: number;
  };
  autoPadding?: boolean;
};

type ModalType = 'fade' | 'slide';
type NestedModalProps = Omit<ModalViewProps, 'dimension'> & {
  modalType?: ModalType;
  autoTransform?: boolean;
  transformBreakPoint?: number;
  extraData?: unknown;
  dimension?: {
    width: number;
    height: number;
  };
};

type ModalSectionProps = {
  enable: boolean;
  keyboardHeight?: number;
  safeAreaInsets?: SafeAreaInsets;
  defaultModalProps?: Partial<NestedModalProps>;
  dimension?: {
    width: number;
    height: number;
  };
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
