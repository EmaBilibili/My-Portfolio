import { useEffect, useRef } from 'react';

/**
 * Synchronizes React open state with a native <dialog> element using showModal()
 * and provides a progressive-enhancement light-dismiss fallback where `closedby`
 * is not yet supported (e.g., Safari).
 */
export function useNativeDialog({ isOpen, onAfterOpen }) {
  const dialogRef = useRef(null);
  const onAfterOpenRef = useRef(onAfterOpen);

  useEffect(() => {
    onAfterOpenRef.current = onAfterOpen;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      onAfterOpenRef.current?.();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return undefined;

    let pressedOutside = false;

    const isOutside = (event) => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    const handlePointerDown = (event) => {
      pressedOutside = dialog.open && isOutside(event);
    };

    const handlePointerUp = (event) => {
      if (pressedOutside && dialog.open && isOutside(event)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return dialogRef;
}
