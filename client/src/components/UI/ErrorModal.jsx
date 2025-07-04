import {useEffect} from "react";
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
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>error</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ErrorModal;
