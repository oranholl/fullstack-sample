import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN, REGISTER } from "../graphql/queries";
import { DEMO_CREDENTIALS } from "../constants/pokemon";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN);
  const [register, { loading: registerLoading, error: registerError }] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const mutation = isLogin ? login : register;
      const { data } = await mutation({
        variables: form,
      });

      const result = isLogin ? data.login : data.register;
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      navigate("/");
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  const loading = loginLoading || registerLoading;
  const error = loginError || registerError;

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          {isLogin ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="form-input"
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="form-input"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="form-error">
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="form-button"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="login-toggle">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-button"
          >
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>

        <div className="demo-credentials">
          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Demo credentials:</p>
          {DEMO_CREDENTIALS.map((cred, index) => (
            <p key={index}>
              Username: <strong>{cred.username}</strong> / Password: <strong>{cred.password}</strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
