import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const BackendLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/backend");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-4xl text-foreground mb-8 text-center">ADMIN</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-body">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BackendLogin;
