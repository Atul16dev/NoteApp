import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (data.success) {
        toast.success("Your account is ready. Sign in to continue.");
        navigate("/login");
      } else {
        toast.error(data.message || "We couldn’t create your account.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "We couldn’t create your account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="A calmer home for your thoughts starts here."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="inline-link">
            Sign in
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="signup-name">Your name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            maxLength={60}
            placeholder="How should we call you?"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            placeholder="At least 6 characters"
            required
          />
        </div>

        <button
          type="submit"
          className="button button-primary auth-submit"
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Create account"}
          {!submitting && <ArrowRight size={17} />}
        </button>
        <p className="auth-secure-note">
          <LockKeyhole size={13} />
          Your notes are private to your account.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
