import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import { NestedModal } from '@nguyentc21/react-native-modal-view';

import type { ViewStyle, StyleProp } from 'react-native';
import type { NestedModalProps } from '@nguyentc21/react-native-modal-view/types';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  label: string;
}

const MyModalContent = (props: Props) => {
  const { label } = props;
  const [count, setCount] = useState(0);
  const [modalVisible1, setModalVisible1] = useState(false);

  console.log(`      MY MODAL CONTENT ${label}`);
  return (
    <>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 30,
        }}>
        {label}
      </Text>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>COUNT: {count}</Text>
      <Pressable
        style={{
          padding: 15,
          alignSelf: 'center',
          backgroundColor: '#33ccaa',
          marginTop: 10,
        }}
        onPress={() => setCount((c) => c + 1)}>
        <Text>COUNT + 1</Text>
      </Pressable>

      <Pressable
        style={{
          padding: 15,
          alignSelf: 'center',
          backgroundColor: '#dd6719',
          marginTop: 20,
        }}
        onPress={() => setModalVisible1(true)}>
        <Text>Open inside-modal</Text>
      </Pressable>

      <NestedModal
        containerStyle={{
          backgroundColor: '#ccc',
          marginTop: '40%',
          width: '80%',
          padding: 40,
        }}
        visible={modalVisible1}
        close={() => setModalVisible1(false)}>
        <InsideModalContent label={label} />
      </NestedModal>
    </>
  );
};

const InsideModalContent = (props: { label: string }) => {
  const [count, setCount] = useState(0);
  console.log(`        MY NESTED MODAL CONTENT ${props.label}`);
  return (
    <>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 30 }}>
        This is inside-modal of {props.label}
      </Text>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>COUNT: {count}</Text>
      <Pressable
        style={{
          padding: 15,
          alignSelf: 'center',
          backgroundColor: '#33ccaa',
          marginTop: 10,
        }}
        onPress={() => setCount((c) => c + 1)}>
        <Text>COUNT + 1</Text>
      </Pressable>
    </>
  );
};

const MyModal = (props: NestedModalProps & { label: string }) => {
  console.log(`    MY MODAL ${props.label}`);
  return (
    <NestedModal containerStyle={{ padding: 20 }} {...props}>
      <MyModalContent {...props} />
      {props.children}
    </NestedModal>
  );
};

export default MyModal;
