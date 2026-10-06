import { useEffect, useRef, useState } from "react";
import {
  BookOpenText,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const SearchInput = ({ inputRef, setQuery }) => (
  <label className="search-field">
    <Search size={17} aria-hidden="true" />
    <input
      ref={inputRef}
      type="search"
      placeholder="Search your notes"
      aria-label="Search notes"
      onChange={(event) => setQuery(event.target.value)}
    />
    <kbd>Ctrl K</kbd>
  </label>
);

const Navbar = ({ setQuery }) => {
  const { user, handleLogout, theme, toggleTheme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const focusSearch = (event) => {
      if (
        user &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        if (window.matchMedia("(max-width: 720px)").matches) {
          setMenuOpen(true);
          window.requestAnimationFrame(() => mobileSearchRef.current?.focus());
        } else {
          desktopSearchRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [user]);

  return (
    <header className="topbar">
      <nav className="topbar-inner" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Notely home">
          <span className="brand-mark">
            <BookOpenText size={20} strokeWidth={2.2} />
          </span>
          <span>notely</span>
        </Link>

        <div className="nav-search">
          {user && (
            <SearchInput inputRef={desktopSearchRef} setQuery={setQuery} />
          )}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <div className="user-chip">
                <span className="user-avatar">
                  {(user.name || "N").slice(0, 1).toUpperCase()}
                </span>
                <span className="user-name">{user.name}</span>
              </div>
              <button
                type="button"
                className="button button-quiet nav-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <div className="desktop-auth-links">
              <Link className="button button-quiet" to="/login">
                Sign in
              </Link>
              <Link className="button button-primary button-small" to="/register">
                Get started
              </Link>
            </div>
          )}

          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {user ? (
            <>
              <SearchInput inputRef={mobileSearchRef} setQuery={setQuery} />
              <div className="mobile-user">
                <UserRound size={17} />
                <span>{user.name}</span>
              </div>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                className="button button-quiet"
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                className="button button-primary"
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
