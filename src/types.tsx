import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface ModalViewProps {
  containerStyle?: StyleProp<ViewStyle>;
  wrapContainerStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  id?: string;
  visible: boolean;
  close?(): void;
  blurToClose?: boolean;
  maxHeight?: ViewStyle['maxHeight'];
  keyboardHeight?: number;
  onOpen?(id?: string): void;
  onDidOpen?(id?: string): void;
  onClose?(id?: string): void;
  onMainContentLayout?(e: LayoutChangeEvent, id?: string): void;
  children?: ReactNode;
  wrapContent?: ReactNode;
}

export type ModalType = 'fade' | 'slide';
export type NestedModalProps = ModalViewProps & {
  id?: string;
  modalType?: ModalType;
  autoTransform?: boolean;
  transformBreakPoint?: number;
  updateKey?: number | string;
  extraData?: any;
};
