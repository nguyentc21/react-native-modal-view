import { useReducer, useEffect } from 'react';

import EventRegister from '../services/EvenRegister';
import { mergeProps } from '../helpers';
import useStableCallback from './utils/useStableCallback';

import type { ModalSectionProps, NestedModalProps } from '../types';

// ============================================================================
// Types
// ============================================================================

type ModalState = NestedModalProps & {
  closedAt?: number; // timestamp khi modal được đóng
};

type ModalListState = ModalState[];

type ModalAction =
  | { type: 'OPEN_MODAL'; payload: NestedModalProps }
  | {
      type: 'CLOSE_MODAL';
      payload: { id: string; onClosed?(id: string): void };
    }
  | { type: 'UPDATE_MODAL'; payload: NestedModalProps }
  | { type: 'CLEAN_UP'; payload: string };

// ============================================================================
// Reducer - Tập trung logic, dễ test, tránh re-render không cần thiết
// ============================================================================

function modalReducer(
  state: ModalListState,
  action: ModalAction,
): ModalListState {
  switch (action.type) {
    case 'OPEN_MODAL': {
      const newModal = action.payload;

      // Kiểm tra xem modal này đã tồn tại chưa
      const existingIndex = state.findIndex((m) => m.id === newModal.id);

      if (existingIndex !== -1) {
        // Modal đã tồn tại, update và mở lại
        return state.map((modal, index) =>
          index === existingIndex
            ? { ...newModal, visible: true, closedAt: undefined }
            : modal,
        );
      }

      // Modal mới, thêm vào cuối danh sách
      return [...state, { ...newModal, visible: true, closedAt: undefined }];
    }

    case 'CLOSE_MODAL': {
      const { id, onClosed } = action.payload;
      const now = Date.now();

      return state.map((modal) => {
        if (modal.id === id) {
          return {
            ...modal,
            visible: false,
            closedAt: now,
            onClose: () => {
              onClosed?.(modal.id);
              return modal?.onClose?.();
            },
          };
        }
        return modal;
      });
    }

    case 'UPDATE_MODAL': {
      const updatedModal = action.payload;

      return state.map((modal) =>
        modal.id === updatedModal.id ? updatedModal : modal,
      );
    }

    case 'CLEAN_UP': {
      const modalId = action.payload;
      return state.filter((modal) => modal.id !== modalId);
    }

    default:
      return state;
  }
}

const useController = (
  params: Pick<ModalSectionProps, 'defaultModalProps' | 'enable'>,
) => {
  const { defaultModalProps, enable } = params;

  const [modalListState, dispatch] = useReducer(modalReducer, []);

  const openModalItem = useStableCallback(
    (nestedModalProps: NestedModalProps) => {
      const _props = mergeProps<NestedModalProps>(
        defaultModalProps,
        nestedModalProps,
      );
      dispatch({ type: 'OPEN_MODAL', payload: _props });
    },
  );

  const closeModalItem = useStableCallback((id: string) => {
    dispatch({
      type: 'CLOSE_MODAL',
      payload: {
        id,
        onClosed: (_id) => {
          // clean dữ liệu modal sau khi đóng hoàn tất
          dispatch({ type: 'CLEAN_UP', payload: _id });
        },
      },
    });
  });

  const updateModalItem = useStableCallback(
    (nestedModalProps: NestedModalProps) => {
      const _props = mergeProps<NestedModalProps>(
        defaultModalProps,
        nestedModalProps,
      );
      dispatch({ type: 'UPDATE_MODAL', payload: _props });
    },
  );

  useEffect(() => {
    if (!enable) return;

    EventRegister.on('open-nested-modal', openModalItem);
    EventRegister.on('close-nested-modal', closeModalItem);
    EventRegister.on('update-nested-modal', updateModalItem);

    return () => {
      EventRegister.rm('open-nested-modal');
      EventRegister.rm('close-nested-modal');
      EventRegister.rm('update-nested-modal');
    };
  }, [enable, openModalItem, closeModalItem, updateModalItem]);

  return modalListState;
};

export default useController;
