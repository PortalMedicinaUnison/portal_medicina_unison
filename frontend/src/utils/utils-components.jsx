import { useEffect, useRef } from "react";

export default function Modal({ open, title, onClose, children }) {
    const dialogRef = useRef(null);
    const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;
  
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
  
      const handleCancel = (e) => {
        e.preventDefault(); // Esc
        onClose?.();
      };
  
      if (open && !dialog.open) dialog.showModal();
      if (!open && dialog.open) dialog.close();
  
      dialog.addEventListener("cancel", handleCancel);
      return () => dialog.removeEventListener("cancel", handleCancel);
    }, [open, onClose]);
  
    const handleBackdropClick = (e) => {
      if (e.target === dialogRef.current) onClose?.();
    };
  
    return (
      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={handleBackdropClick}
        className="rounded-2xl p-0 border outline-none w-[min(92vw,40rem)] max-w-full"
      >
        <div className="p-6 space-y-6">
          <h3 id={titleId} className="text-lg font-semibold">{title}</h3>
  
          <div>{children}</div>
  
        </div>
      </dialog>
    );
  }