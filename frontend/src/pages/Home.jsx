import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, FilePlus2, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import heroImage from "../assets/hero.png";

const Home = () => {
  const { user, authReady } = useAuth();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authReady) return undefined;

    if (!user) return undefined;

    let isCurrent = true;
    const fetchNotes = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const { data } = await api.get("/note");
        if (isCurrent) {
          setNotes(data.notes || []);
        }
      } catch (error) {
        if (isCurrent) {
          const message =
            error.response?.data?.message ||
            "We couldn’t load your notes. Please try again.";
          setLoadError(message);
          toast.error(message);
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchNotes();
    return () => {
      isCurrent = false;
    };
  }, [authReady, user, reloadKey]);

  const tags = useMemo(
    () =>
      [...new Set(notes.map((note) => note.tag?.trim() || "General"))].sort(
        (first, second) => first.localeCompare(second),
      ),
    [notes],
  );

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return notes
      .filter((note) => {
        const matchesTag =
          selectedTag === "all" ||
          (note.tag?.trim() || "General") === selectedTag;
        const matchesQuery =
          !normalizedQuery ||
          `${note.title} ${note.description} ${note.tag || ""}`
            .toLocaleLowerCase()
            .includes(normalizedQuery);
        return matchesTag && matchesQuery;
      })
      .sort((first, second) => {
        const firstDate = new Date(first.updatedAt || first.createdAt || 0);
        const secondDate = new Date(second.updatedAt || second.createdAt || 0);
        return sortOrder === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [notes, query, selectedTag, sortOrder]);

  const closeNoteEditor = () => {
    setModalOpen(false);
    setCurrentNote(null);
  };

  const addNote = async (note) => {
    try {
      const { data } = await api.post("/note/add", {
        ...note,
        title: note.title.trim(),
        description: note.description.trim(),
        tag: note.tag.trim() || "General",
      });
      if (data.success) {
        setNotes((existingNotes) => [data.note, ...existingNotes]);
        toast.success("Your note is saved.");
        closeNoteEditor();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "We couldn’t save your note.",
      );
    }
  };

  const editNote = async (id, note) => {
    try {
      const { data } = await api.put(`/note/${id}`, {
        ...note,
        title: note.title.trim(),
        description: note.description.trim(),
        tag: note.tag.trim() || "General",
      });
      if (data.success) {
        setNotes((existingNotes) =>
          existingNotes.map((existingNote) =>
            existingNote._id === data.note._id ? data.note : existingNote,
          ),
        );
        toast.success("Your changes are saved.");
        closeNoteEditor();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "We couldn’t update your note.",
      );
    }
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/note/${noteToDelete._id}`);
      if (data.success) {
        setNotes((existingNotes) =>
          existingNotes.filter((note) => note._id !== noteToDelete._id),
        );
        toast.success("Note deleted.");
        setNoteToDelete(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "We couldn’t delete your note.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const startEditing = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  const startCreating = () => {
    setCurrentNote(null);
    setModalOpen(true);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  return (
    <div className="app-shell">
      <Navbar setQuery={handleQueryChange} />

      {!authReady ? (
        <main className="page-container">
          <div className="loading-panel" role="status" aria-live="polite">
            <span className="spinner" />
            <span>Getting your space ready…</span>
          </div>
        </main>
      ) : !user ? (
        <main className="landing page-container">
          <section className="landing-hero">
            <div className="landing-copy">
              <span className="eyebrow">
                <Sparkles size={14} />
                YOUR SPACE TO THINK
              </span>
              <h1>
                Make room for
                <br />
                <span>your best ideas.</span>
              </h1>
              <p>
                A calmer place for everything on your mind. Capture ideas,
                organize what matters, and find it all again in seconds.
              </p>
              <div className="landing-actions">
                <Link to="/register" className="button button-primary">
                  Start writing for free
                  <ArrowRight size={17} />
                </Link>
                <Link to="/login" className="button button-quiet">
                  I already have an account
                </Link>
              </div>
              <div className="landing-proof">
                <span className="proof-dot" />
                Your thoughts, organized and always yours
              </div>
            </div>
            <div className="landing-art" aria-hidden="true">
              <div className="art-glow" />
              <div className="art-orbit art-orbit-one" />
              <div className="art-orbit art-orbit-two" />
              <img src={heroImage} alt="" />
              <div className="art-caption">
                <span className="art-caption-icon">
                  <FilePlus2 size={16} />
                </span>
                <span>
                  <strong>A little more clarity</strong>
                  <small>One note at a time</small>
                </span>
              </div>
            </div>
          </section>

          <section className="landing-features" aria-label="Product highlights">
            <article>
              <span className="feature-number">01</span>
              <div>
                <h2>Catch every thought</h2>
                <p>Write things down quickly, without getting in your way.</p>
              </div>
            </article>
            <article>
              <span className="feature-number">02</span>
              <div>
                <h2>Find your focus</h2>
                <p>Keep ideas easy to browse with simple categories and search.</p>
              </div>
            </article>
            <article>
              <span className="feature-number">03</span>
              <div>
                <h2>Make it yours</h2>
                <p>A quiet, personal workspace that’s ready whenever you are.</p>
              </div>
            </article>
          </section>
        </main>
      ) : (
        <main className="page-container dashboard">
          <section className="dashboard-heading">
            <div>
              <span className="eyebrow">YOUR WORKSPACE</span>
              <h1>
                Good to see you, {user.name?.split(" ")[0] || "there"}.
              </h1>
              <p>Your thoughts, gathered in one place.</p>
            </div>
            <button
              type="button"
              className="button button-primary create-button"
              onClick={startCreating}
              aria-label="Create a new note"
            >
              <FilePlus2 size={17} />
              New note
            </button>
          </section>

          <section className="workspace-summary" aria-label="Note statistics">
            <div className="summary-card">
              <span className="summary-icon summary-icon-violet">
                <FilePlus2 size={18} />
              </span>
              <span className="summary-value">{notes.length}</span>
              <span className="summary-label">
                {notes.length === 1 ? "note in your space" : "notes in your space"}
              </span>
            </div>
            <div className="summary-divider" />
            <div className="summary-copy">
              <span className="summary-copy-title">
                {notes.length ? "A little progress adds up." : "Start with one idea."}
              </span>
              <span>
                {notes.length
                  ? "Keep collecting the thoughts you want to come back to."
                  : "Create a note and give your thoughts a home."}
              </span>
            </div>
          </section>

          <section className="notes-section">
            <div className="notes-toolbar">
              <div className="notes-section-title">
                <h2>All notes</h2>
                <span className="count-pill">{notes.length}</span>
              </div>
              <div className="note-filters">
                <label className="filter-control">
                  <span className="visually-hidden">Filter by category</span>
                  <select
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                    aria-label="Filter notes by category"
                  >
                    <option value="all">All categories</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="filter-control sort-control">
                  <ArrowDownUp size={15} aria-hidden="true" />
                  <span className="visually-hidden">Sort notes</span>
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    aria-label="Sort notes"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="loading-panel notes-loading" role="status">
                <span className="spinner" />
                <span>Loading your notes…</span>
              </div>
            ) : loadError ? (
              <div className="empty-state error-state" role="alert">
                <span className="empty-icon">
                  <Search size={24} />
                </span>
                <h3>We couldn’t load your notes</h3>
                <p>{loadError}</p>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  Try again
                </button>
              </div>
            ) : visibleNotes.length ? (
              <>
                <p className="results-caption">
                  Showing {visibleNotes.length}{" "}
                  {visibleNotes.length === 1 ? "note" : "notes"}
                  {query.trim() ? ` matching “${query.trim()}”` : ""}
                </p>
                <div className="notes-grid">
                  {visibleNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={startEditing}
                      onDelete={setNoteToDelete}
                    />
                  ))}
                </div>
              </>
            ) : notes.length ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <Search size={24} />
                </span>
                <h3>No notes match that search</h3>
                <p>Try a different phrase or clear your filters.</p>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    handleQueryChange("");
                    setSelectedTag("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">
                  <FilePlus2 size={24} />
                </span>
                <h3>Your space is yours to fill</h3>
                <p>
                  Save an idea, a reminder, or anything you want to remember.
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={startCreating}
                >
                  <FilePlus2 size={16} />
                  Create your first note
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {user && (
        <>
          <NoteModal
            key={`${isModalOpen}-${currentNote?._id || "new"}`}
            isOpen={isModalOpen}
            onClose={closeNoteEditor}
            addNote={addNote}
            currentNote={currentNote}
            editNote={editNote}
          />
          <ConfirmDialog
            note={noteToDelete}
            onCancel={() => setNoteToDelete(null)}
            onConfirm={deleteNote}
            deleting={deleting}
          />
        </>
      )}
    </div>
  );
};

export default Home;
