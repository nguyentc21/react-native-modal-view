import React from 'react';
import { View, Animated, Pressable, StyleSheet } from 'react-native';

import useController from './useController';
import useStyles from './useStyles';

import gStyles from '../../../styles';

import type { ModalViewProps } from '../../../types';

function FadeModalView(props: ModalViewProps) {
  const {
    wrapContainerStyle,
    backdropStyle,
    style,
    containerStyle,
    contentContainerStyle,
    visible,
    close: closeModal,
    onOpen,
    onDidOpen,
    onClose,
    maxHeight,
    keyboardHeight,
    safeAreaInsets,
    onContainerLayout,
    onMainContentLayout,
    blurToClose = true,
    children,
    additionContent,
    bottomOffset,
    dimension,
    autoPadding = true,
  } = props;

  const { animatedStyles, modalVisible } = useController({
    onOpen,
    onDidOpen,
    onDidClose: onClose,
    visible,
  });

  const { containerStyles } = useStyles({
    maxHeight,
    keyboardHeight,
    safeAreaInsets,
    bottomOffset,
    dimension,
    autoPadding,
  });

  if (!modalVisible) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, wrapContainerStyle, animatedStyles]}>
      <Pressable
        onPress={() => closeModal?.()}
        disabled={!blurToClose || !closeModal}
        style={[StyleSheet.absoluteFill, gStyles.backdrop, backdropStyle]}
      />
      <View
        pointerEvents={'box-none'}
        onLayout={onContainerLayout}
        style={[lStyles.container, containerStyles, containerStyle]}>
        <View
          style={[lStyles.contentContainer, style, contentContainerStyle]}
          onLayout={onMainContentLayout}>
          {children}
        </View>
      </View>
      {additionContent}
    </Animated.View>
  );
}

const lStyles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    overflow: 'hidden',
    flexShrink: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
});

export default FadeModalView;
