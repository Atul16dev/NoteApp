import React, { useEffect, useState } from "react";

const NoteModal = ({ isOpen, onClose, addNote, currentNote, editNote }) => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  // Input Handler
  const handleChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (currentNote) {
      setNote({
        title: currentNote.title,
        description: currentNote.description,
        tag: currentNote.tag,
      });
    }
  }, [currentNote]);

  // Reset Form
  const resetForm = () => {
    setNote({
      title: "",
      description: "",
      tag: "",
    });
  };

  // Cancel Modal
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // ESC Key Close
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", closeOnEsc);

    return () => {
      window.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentNote) {
      editNote(currentNote._id, note);
    } else {
      addNote(note);

      resetForm();
    }
  };

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-xl rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-8 text-3xl font-bold">
          {currentNote ? "Edit Note" : "Add New Note"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}

          <div className="mb-5">
            <label className="font-medium text-gray-700">Title</label>

            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Enter title..."
              className="w-full px-4 py-3 mt-2 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-400"
            />

            <p className="mt-1 text-xs text-gray-500">{note.title.length}/50</p>
          </div>

          {/* Description */}

          <div className="mb-5">
            <label className="font-medium text-gray-700">Description</label>

            <textarea
              rows={5}
              name="description"
              value={note.description}
              onChange={handleChange}
              placeholder="Write your note..."
              className="w-full px-4 py-3 mt-2 border border-gray-300 outline-none resize-none rounded-xl focus:ring-2 focus:ring-indigo-400"
            />

            <p className="text-xs text-gray-500">
              {note.description.length}/500
            </p>
          </div>

          {/* Tag */}

          <div className="mb-8">
            <label className="font-medium text-gray-700">Tag</label>

            <input
              type="text"
              name="tag"
              value={note.tag}
              onChange={handleChange}
              placeholder="Study, Personal..."
              className="w-full px-4 py-3 mt-2 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={note.title.trim().length < 3}
              className={`rounded-lg px-6 py-2 text-white transition ${
                note.title.trim().length < 3
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {currentNote ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
