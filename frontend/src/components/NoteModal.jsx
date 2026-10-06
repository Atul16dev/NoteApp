import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";

const NoteModal = ({ isOpen, onClose, addNote, currentNote, editNote }) => {
  const [note, setNote] = useState(() => ({
    title: currentNote?.title || "",
    description: currentNote?.description || "",
    tag: currentNote?.tag || "",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (currentNote) {
        await editNote(currentNote._id, note);
      } else {
        await addNote(note);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <section
        className="note-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
      >
        <header className="modal-header">
          <div className="modal-heading">
            <span className="modal-icon">
              <FileText size={19} />
            </span>
            <div>
              <h2 id="note-modal-title">
                {currentNote ? "Edit note" : "Create a note"}
              </h2>
              <p>Capture a thought while it’s fresh.</p>
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close note editor"
          >
            <X size={19} />
          </button>
        </header>

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="note-title">Title</label>
            <input
              autoFocus
              id="note-title"
              name="title"
              value={note.title}
              onChange={handleChange}
              maxLength={80}
              minLength={3}
              required
              placeholder="Give your note a clear title"
            />
            <span className="field-hint">{note.title.length}/80</span>
          </div>

          <div className="form-field">
            <label htmlFor="note-description">Your note</label>
            <textarea
              id="note-description"
              name="description"
              value={note.description}
              onChange={handleChange}
              maxLength={2000}
              required
              rows={7}
              placeholder="Start writing..."
            />
            <span className="field-hint">
              {note.description.length}/2000
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="note-tag">Category</label>
            <input
              id="note-tag"
              name="tag"
              value={note.tag}
              onChange={handleChange}
              maxLength={32}
              placeholder="General"
            />
            <span className="field-hint">A short label keeps things tidy.</span>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="button button-quiet"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={
                saving ||
                note.title.trim().length < 3 ||
                !note.description.trim()
              }
            >
              {saving
                ? "Saving…"
                : currentNote
                  ? "Save changes"
                  : "Create note"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default NoteModal;
