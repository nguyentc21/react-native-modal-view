# @nguyentc21/react-native-modal-view

React native Modal view

## Installation

```sh
yarn add @nguyentc21/react-native-modal-view
```

## Usage

In your root-level component.

```tsx
import ModalView from '@nguyentc21/react-native-modal-view';
// ...
const App = () => {
  return (
    // ...
    // This will contain all your nested modals
    <ModalView /> // should be on bottom
  );
};
// ...
```

Other View
```tsx
// ...
import { NestedModal, Modal } from '@nguyentc21/react-native-modal-view';
// ...

const ModalContent = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <Text>
        Otherwise, change Inside-Count will make modal content re-render, but not NiceView
        Inside-Count: {count}
      </Text>
      <View>
        <Pressable
          onPress={() => { setCount((_count) => _count + 1) }}
        >
          Inside-Count + 1
        </Pressable>
      </View>
    </>
  )
}

const NiceView = (props: Props) => {
  const [nestedModalVisible, setNestedModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [count, setCount] = useState(0);
  // ...
  return (
    // ...
    <NestedModal
      visible={nestedModalVisible}
      close={() => { setNestedModalVisible(false )}}
      containerStyle={{ backgroundColor: 'grey', padding: 50 }}
      // updateKey={dynamicValue} // change value will help this modal re-render
    >
      <Text>
        This is your app modal
      <Text>
      <Text>
        Change Outside-Count will make NiceView re-render, but not the modal content
        Outside-Count: {count}
      </Text>
      <View>
        <Pressable
          onPress={() => { setCount((_count) => _count + 1) }}
        >
          Outside-Count + 1
        </Pressable>
      </View>
      <ModalContent />
    </NestedModal>

    <Modal
      // modalType={"slide"}
      visible={customModalVisible}
      close={() => { setCustomModalVisible(false )}}
      containerStyle={{ backgroundColor: 'blue', padding: 10 }}
    >
      <Text>
        This is your inside-component modal
      <Text>
    </Modal>
    // ...
  )
}
```

## Props
| Name           | Type                                      | Default                            | description                                                                               |
|----------------|-------------------------------------------|------------------------------------|-------------------------------------------------------------------------------------------|
| modalType      | 'fade' \| 'slide'                         | 'fade'                             |                                                                                           |
| visible        | boolean                                   | REQUIRED                           |                                                                                           |
| close          | () => void                                |                                    | Function help close modal. Called when the backdrop is pressed and "blurToClose" is true. |
| blurToClose    | boolean                                   | true                               | true: On press backdrop will call the "close" function.                                   |
| maxHeight      | ViewStyle['maxHeight']                    | Fade modal: 60%; Slide modal: 90%; |                                                                                           |
| onOpen         | (id?: string) => void                     |                                    | Called when the modal start show animation begins                                         |
| onDidOpen      | (id?: string) => void                     |                                    | Called when the modal is completely visible                                               |
| onClose        | (id?: string) => void                     |                                    | Called when the modal is completely hidden                                                |
| edges          | (top' \| 'bottom' \| 'left' \| 'right')[] |                                    | https://github.com/th3rdwave/react-native-safe-area-context#edges                         |
| children       | ReactNode                                 |                                    | Your modal content                                                                        |
| containerStyle | ViewStyle                                 |                                    |                                                                                           |
| backdropStyle  | ViewStyle                                 |                                    |                                                                                           |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
