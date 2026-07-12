import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import Swal from "sweetalert2";

import { useAuth } from "../context/ContextProvider"; ///

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [notesLoaded, setNotesLoaded] = useState(false); //

  const { user } = useAuth();

useEffect(() => {
  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      setNotesLoaded(true);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setNotes([]);
      setLoading(false);
      setNotesLoaded(true);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:5000/api/note",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(data.notes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setNotesLoaded(true);
    }
  };

  fetchNotes();
}, [user]);


  useEffect(() => {
  if (!user) {
    setNotes([]);
    setFilteredNotes([]);
  }
}, [user]);
  

  useEffect(() => {
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLocaleLowerCase()) ||
          note.description.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
    );
  }, [query, notes]);

  const onEdit = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  //Add Notes
  const addNote = async (note) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/note/add",
        note,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // UI Update
        setNotes((prevNotes) => [...prevNotes, response.data.note]);

        toast.success("Note Added Successfully 💖");

        setModalOpen(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong ");
    }
  };
  //DELETE NOTE
  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //conferm before delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Note?",
      text: "You won't be able to recover this note!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteNote(id);

      Swal.fire({
        title: "Deleted!",
        text: "Your note has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  //EDIT NOTE
  const editNote = async (id, note) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/${id}`,
        note,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // UI Update
        setNotes((prevNotes) =>
          prevNotes.map((item) =>
            item._id === response.data.note._id ? response.data.note : item,
          ),
        );

        toast.success("Note Edited Successfully");

        setModalOpen(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setQuery={setQuery} />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-gray-200"></div>

                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-700 animate-spin"></div>

                <div className="absolute inset-3 rounded-full bg-gray-100 animate-pulse"></div>
              </div>

              <p className="text-sm tracking-[0.25em] uppercase text-gray-500">
                Loading Notes...
              </p>
            </div>
          </div>
        ) : !notesLoaded ? null : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              note={note}
              onEdit={onEdit}
              key={note._id}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full py-24 text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-6 text-5xl bg-gray-100 rounded-full shadow-sm">
              📝
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              {query ? "No Notes Found" : "No Notes Yet"}
            </h2>

            <p className="max-w-md mt-3 text-gray-500">
              {query
                ? `We couldn't find any notes matching "${query}".`
                : "Start by creating your first note. Your notes will appear here."}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed p-4 text-2xl font-bold text-white bg-teal-500 rounded-full right-4 bottom-4"
      >
        +
      </button>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        addNote={addNote}
        currentNote={currentNote}
        editNote={editNote}
      />
    </div>
  );
};

export default Home;
