import {useEffect} from "react";
import "./ErrorModal.css";
function ErrorModal({isOpen, onClose, message}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  return (
    <div className="error-modal-backdrop">
      <div className="error-modal-content">
        <h2>⚠️ error ⚠️</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ErrorModal;
