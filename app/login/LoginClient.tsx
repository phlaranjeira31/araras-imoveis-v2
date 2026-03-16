"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    return searchParams.get("callbackUrl") || "/admin/imoveis";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, 
      callbackUrl,
    });

    if (!res) {
      setError("Falha ao autenticar.");
      setLoading(false);
      return;
    }

    if (res.error) {
      setError("Email ou senha inválidos.");
      setLoading(false);
      return;
    }

    window.location.href = res.url || callbackUrl;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate-600 mt-1">Acesso restrito (admin).</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Digite o email válido"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Senha</label>
            <input
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-leaf px-4 py-2 text-white font-medium disabled:opacity-60"
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}