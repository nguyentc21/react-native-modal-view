# @nguyentc21/react-native-modal-view

React native Modal view

## Installation

```sh
yarn add @nguyentc21/react-native-modal-view
```

## Usage

```tsx
import ModalSection from '@nguyentc21/react-native-modal-view';
// ...
const App = () => {
  return (
    // ...

    <ModalSection // should be on bottom
      enable
      // safeAreaInsets={safeAreaInsets}
      // keyboardHeight={keyboardHeight}
      // defaultModalProps={{
      //   blurToClose: true,
      //   styles: {
      //     backgroundColor: '#eeeeee',
      //     borderRadius: 0,
      //     borderTopLeftRadius: 0,
      //     borderTopRightRadius: 0,
      //   },
      //   contentContainerStyle: {
      //     padding: 20,
      //   },
      // }}
    />
  );
};
// ...
```

```tsx
// ...
import { NestedModal } from '@nguyentc21/react-native-modal-view';

const ModalContent = () => {
  const [countState, setCountState] = useState(0);
  return (
    <>
      <Text>count: {countState}</Text>
      <View>
        <Pressable
          onPress={() => {
            setCountState((_c) => _c + 1);
          }}>
          count + 1
        </Pressable>
      </View>
    </>
  );
};
const NiceView = (props: Props) => {
  const [nestedModalVisible, setNestedModalVisible] = useState(false);
  // ...
  return (
    // ...
    <NestedModal
      visible={nestedModalVisible}
      close={() => setNestedModalVisible(false)}>
      <ModalContent />
    </NestedModal>
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
