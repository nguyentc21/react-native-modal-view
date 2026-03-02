import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import useController from './useController';
import useStyles from './useStyles';

import useStableCallback from '../../../hooks/utils/useStableCallback';
import gStyles from '../../../styles';

import type { LayoutChangeEvent } from 'react-native';
import type { ModalViewProps } from '../../../types';

function SliderModalView(props: ModalViewProps) {
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
    onMainContentLayout,
    children,
    additionContent,
    keyboardHeight,
    safeAreaInsets,
    blurToClose = true,
    maxHeight = '95%',
    dimension,
    autoPadding = true,
  } = props;

  const { height } = dimension;

  const [contentLayout, setContentLayout] = useState({ height });

  const _onModalContentLayout = useStableCallback((e: LayoutChangeEvent) => {
    onMainContentLayout?.(e);
    const layout = e.nativeEvent?.layout;
    setContentLayout(layout);
  });

  const { animatedStyles, animatedContentStyles, modalVisible } = useController(
    {
      onOpen,
      onDidOpen,
      onDidClose: onClose,
      visible,
      contentHeight: contentLayout.height,
      maxHeight: height,
    },
  );

  const { containerStyles, contentContainerStyles } = useStyles({
    maxHeight,
    keyboardHeight,
    safeAreaInsets,
    autoPadding,
  });

  if (!modalVisible) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: 'flex-end',
        },
        animatedStyles,
        wrapContainerStyle,
      ]}>
      <Pressable
        onPress={() => closeModal?.()}
        disabled={!blurToClose || !closeModal}
        style={[StyleSheet.absoluteFill, gStyles.backdrop, backdropStyle]}
      />
      <Animated.View
        onLayout={_onModalContentLayout}
        style={[
          lStyles.containerStyle,
          containerStyles,
          containerStyle,
          style,
          animatedContentStyles,
        ]}>
        <View
          style={[
            lStyles.contentContainerStyle,
            contentContainerStyles,
            contentContainerStyle,
          ]}>
          {children}
        </View>
      </Animated.View>
      {additionContent}
    </Animated.View>
  );
}

const lStyles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainerStyle: {
    overflow: 'hidden',
    flexShrink: 1,
    maxHeight: '100%',
    width: '100%',
  },
});

export default SliderModalView;
