import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        login(data.user);
        toast.success("Welcome back.");
        navigate("/");
      } else {
        toast.error(data.message || "We couldn’t sign you in.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "We couldn’t sign you in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where your ideas left off."
      footer={
        <>
          New to Notely?{" "}
          <Link to="/register" className="inline-link">
            Create an account
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="button button-primary auth-submit"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
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

export default Login;
