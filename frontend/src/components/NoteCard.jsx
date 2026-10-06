import { CalendarDays, Pencil, Trash2 } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const NoteCard = ({ note, onEdit, onDelete }) => {
  const date = note.updatedAt || note.createdAt;

  return (
    <article className="note-card">
      <div className="note-card-accent" />
      <div className="note-card-header">
        <span className="note-tag">{note.tag || "General"}</span>
        <div className="note-actions">
          <button
            type="button"
            className="icon-button note-action"
            onClick={() => onEdit(note)}
            aria-label={`Edit ${note.title}`}
            title="Edit note"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="icon-button note-action note-action-delete"
            onClick={() => onDelete(note)}
            aria-label={`Delete ${note.title}`}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h2 className="note-title">{note.title}</h2>
      <p className="note-description">{note.description}</p>

      <footer className="note-card-footer">
        <span className="note-date">
          <CalendarDays size={14} />
          {date ? dateFormatter.format(new Date(date)) : "Just now"}
        </span>
        {note.updatedAt &&
          note.createdAt &&
          note.updatedAt !== note.createdAt && (
            <span className="edited-label">Edited</span>
          )}
      </footer>
    </article>
  );
};

export default NoteCard;
