import { FaEdit, FaTrash } from "react-icons/fa";

const NoteCard = ({ note, onEdit,onDelete }) => {
  return (
    <div className="relative p-5 transition-all duration-300 bg-white border border-gray-200 shadow-md group rounded-2xl hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
          {note.title}
        </h2>

        <div className="flex gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit?.(note)}
            className="p-2 text-blue-600 transition bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete?.(note._id)}
            className="p-2 text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-4">
        {note.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200">
        <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
          {note.tag}
        </span>

        <span className="text-xs text-gray-400">
          {note.createdAt
            ? new Date(note.createdAt).toLocaleDateString("en-IN")
            : ""}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
