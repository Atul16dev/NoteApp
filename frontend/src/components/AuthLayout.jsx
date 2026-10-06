import { ArrowLeft, BookOpenText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ title, description, children, footer }) => (
  <main className="auth-page">
    <div className="auth-ambient auth-ambient-one" />
    <div className="auth-ambient auth-ambient-two" />
    <div className="auth-container">
      <header className="auth-topbar">
        <Link to="/" className="brand" aria-label="Notely home">
          <span className="brand-mark">
            <BookOpenText size={20} strokeWidth={2.2} />
          </span>
          <span>notely</span>
        </Link>
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </header>

      <section className="auth-content">
        <div className="auth-aside">
          <span className="eyebrow">
            <Sparkles size={14} />
            A CLEARER HEADSPACE
          </span>
          <h1>
            Your thoughts
            <br />
            deserve a <span>home.</span>
          </h1>
          <p>
            Make a little room for good ideas. Notely keeps your thoughts
            organized, so you can focus on what comes next.
          </p>
          <div className="auth-aside-note">
            <span className="auth-aside-line" />
            <span>Less noise. More room to think.</span>
          </div>
        </div>

        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {children}
          <div className="auth-footer">{footer}</div>
        </section>
      </section>
      <footer className="auth-bottom">
        A quiet place for your next big thought.
      </footer>
    </div>
  </main>
);

export default AuthLayout;
