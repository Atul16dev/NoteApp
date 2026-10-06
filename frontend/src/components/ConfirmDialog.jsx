import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({ note, onCancel, onConfirm, deleting }) => {
  if (!note) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onCancel();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !deleting) onCancel();
      }}
    >
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <button
          type="button"
          className="icon-button confirm-close"
          onClick={onCancel}
          aria-label="Close confirmation"
          disabled={deleting}
        >
          <X size={18} />
        </button>
        <span className="confirm-icon">
          <AlertTriangle size={22} />
        </span>
        <h2 id="delete-dialog-title">Delete this note?</h2>
        <p id="delete-dialog-description">
          <strong>{note.title}</strong> will be permanently removed. This
          action can’t be undone.
        </p>
        <div className="confirm-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={onCancel}
            disabled={deleting}
            autoFocus
          >
            Keep note
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete note"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
