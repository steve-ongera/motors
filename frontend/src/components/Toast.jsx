import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: "bi-check-circle-fill", error: "bi-x-circle-fill", info: "bi-info-circle-fill" };

  return (
    <div className={`toast ${type}`}>
      <i className={`bi ${icons[type] || icons.info}`} style={{ fontSize:18, flexShrink:0 }} />
      <span style={{ flex:1 }}>{message}</span>
      <button onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}