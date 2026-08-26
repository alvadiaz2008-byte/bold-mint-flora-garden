import { useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/catalog";

export function AdminGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await loginAdmin({ data: { password } });
      await router.invalidate({ sync: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Contraseña incorrecta";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <p className="text-xs tracking-[0.22em] text-primary uppercase">
        Menú de administrador
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Acceso</h1>
      <p className="mt-2 text-sm text-muted">
        Introduce la contraseña para gestionar el catálogo.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <label className="flex flex-col gap-2">
          <Label htmlFor="admin-password">Contraseña</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button type="submit" className="w-full" disabled={busy}>
          Entrar
        </Button>
      </form>
    </div>
  );
}
