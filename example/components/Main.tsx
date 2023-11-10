import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import MyModal from './MyModal';

const Main = () => {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  console.log(`  MAIN`);
  return (
    <View style={{ flex: 1, backgroundColor: '#eeeeee', padding: 15 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        MAIN
      </Text>
      <Pressable
        style={{
          padding: 10,
          alignSelf: 'center',
          backgroundColor: '#381583',
          marginTop: 20,
        }}
        onPress={() => {
          setModalVisible1(true);
        }}>
        <Text style={{ color: 'white' }}>OPEN MODAL 1</Text>
      </Pressable>
      <MyModal
        visible={modalVisible1}
        close={() => setModalVisible1(false)}
        label="MODAL 1">
        <Pressable
          style={{
            padding: 10,
            alignSelf: 'center',
            backgroundColor: '#381583',
            marginTop: 20,
          }}
          onPress={() => {
            setModalVisible2(true);
          }}>
          <Text style={{ color: 'white' }}>OPEN MODAL 2</Text>
        </Pressable>
      </MyModal>

      <MyModal
        modalType="slide"
        visible={modalVisible2}
        close={() => setModalVisible2(false)}
        label="MODAL 2">
        <Pressable
          style={{
            padding: 10,
            alignSelf: 'center',
            backgroundColor: '#381583',
            marginTop: 20,
          }}
          onPress={() => {
            setModalVisible3(true);
          }}>
          <Text style={{ color: 'white' }}>OPEN MODAL 3</Text>
        </Pressable>
      </MyModal>

      <MyModal
        // modalType='slide'
        visible={modalVisible3}
        close={() => setModalVisible3(false)}
        label="MODAL 3">
        <View style={{ alignSelf: 'center', padding: 60 }}>
          <Text style={{ fontWeight: 'bold' }}>Hello world!!</Text>
        </View>
      </MyModal>
    </View>
  );
};

export default Main;
