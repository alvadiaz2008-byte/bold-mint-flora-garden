import { useRouter } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  deleteProduct,
  logoutAdmin,
  updateProduct,
} from "@/lib/catalog";
import {
  CATEGORIES,
  formatSoles,
  sizesForCategory,
  type Product,
  type ProductColor,
  type ProductInput,
} from "@/lib/catalog-shared";
import { fileToDataUrl } from "@/lib/image-file";

const emptyForm = (category = "uniformes"): ProductInput => ({
  name: "",
  description: "",
  category,
  priceSoles: 0,
  sizes: [...sizesForCategory(category)],
  colors: [{ name: "Olivo", hex: "#4B5320" }],
  images: [],
  material: "",
  weightG: null,
  features: [],
  specs: { Uso: "" },
  featured: false,
});

function productToInput(p: Product): ProductInput {
  return {
    name: p.name,
    description: p.description,
    category: p.category,
    priceSoles: p.priceSoles,
    sizes: p.sizes,
    colors: p.colors.length ? p.colors : [{ name: "Olivo", hex: "#4B5320" }],
    images: p.images,
    material: p.material,
    weightG: p.weightG,
    features: p.features,
    specs: Object.keys(p.specs).length ? p.specs : { Uso: "" },
    featured: p.featured,
  };
}

export function AdminPanel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [featureText, setFeatureText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const sizeOptions = useMemo(
    () => sizesForCategory(form.category),
    [form.category],
  );

  function patch(partial: Partial<ProductInput>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm(productToInput(product));
    setFeatureText(product.features.join("\n"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    setFeatureText("");
    setImageUrl("");
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = [...form.images];
    for (const file of Array.from(files)) {
      if (next.length >= 5) break;
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se aceptan imágenes");
        continue;
      }
      try {
        next.push(await fileToDataUrl(file));
      } catch {
        toast.error("No se pudo leer la foto");
      }
    }
    patch({ images: next });
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    if (form.images.length >= 5) {
      toast.error("Máximo 5 fotos");
      return;
    }
    patch({ images: [...form.images, url] });
    setImageUrl("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const features = featureText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const specs = Object.fromEntries(
      Object.entries(form.specs).filter(([k, v]) => k.trim() && v.trim()),
    );
    const payload: ProductInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      features,
      specs,
      priceSoles: Number(form.priceSoles),
      weightG:
        form.weightG === null || form.weightG === undefined || Number.isNaN(form.weightG)
          ? null
          : Number(form.weightG),
    };
    setBusy(true);
    try {
      if (editingId) {
        await updateProduct({ data: { ...payload, id: editingId } });
        toast.success("Producto actualizado");
      } else {
        await createProduct({ data: payload });
        toast.success("Producto añadido al catálogo");
      }
      resetForm();
      await router.invalidate({ sync: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    setBusy(true);
    try {
      await deleteProduct({ data: { id } });
      toast.success("Producto eliminado");
      if (editingId === id) resetForm();
      setConfirmId(null);
      await router.invalidate({ sync: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo eliminar";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await logoutAdmin();
    await router.invalidate({ sync: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] text-primary uppercase">
            Menú de administrador
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold">
            {editingId ? "Editar producto" : "Añadir producto"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Completa los datos. Al guardar, el producto aparece de inmediato en
            el catálogo.
          </p>
        </div>
        <Button variant="outline" onClick={() => void onLogout()}>
          Cerrar sesión
        </Button>
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nombre">
            <Input
              required
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Camiseta táctica Dry-Fit"
            />
          </Field>
          <Field label="Categoría">
            <select
              className="h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              value={form.category}
              onChange={(e) => {
                const category = e.target.value;
                patch({
                  category,
                  sizes: [...sizesForCategory(category)],
                });
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Precio (soles)">
            <Input
              required
              type="number"
              min="1"
              step="0.01"
              value={form.priceSoles || ""}
              onChange={(e) => patch({ priceSoles: Number(e.target.value) })}
              placeholder="189.00"
            />
          </Field>
          <Field label="Material">
            <Input
              required
              value={form.material}
              onChange={(e) => patch({ material: e.target.value })}
              placeholder="Ripstop polialgodón"
            />
          </Field>
          <Field label="Peso (gramos, opcional)">
            <Input
              type="number"
              min="1"
              value={form.weightG ?? ""}
              onChange={(e) =>
                patch({
                  weightG: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="520"
            />
          </Field>
        </div>

        <Field label="Descripción" className="mt-5">
          <Textarea
            required
            minLength={20}
            value={form.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="Describe el uso, el tejido y los detalles de servicio."
          />
        </Field>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium tracking-wide text-muted uppercase">
            Tallas
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizeOptions.map((s) => {
              const on = form.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    patch({
                      sizes: on
                        ? form.sizes.filter((x) => x !== s)
                        : [...form.sizes, s],
                    })
                  }
                  className={`flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm ${
                    on
                      ? "bg-primary text-primary-fg"
                      : "bg-elevated text-fg shadow-[var(--shadow-border)]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium tracking-wide text-muted uppercase">
            Colores
          </legend>
          <div className="mt-3 space-y-2">
            {form.colors.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={c.name}
                  onChange={(e) => {
                    const colors = [...form.colors];
                    colors[i] = { ...c, name: e.target.value };
                    patch({ colors });
                  }}
                  placeholder="Nombre"
                />
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => {
                    const colors = [...form.colors];
                    colors[i] = { ...c, hex: e.target.value };
                    patch({ colors });
                  }}
                  className="h-11 w-14 cursor-pointer rounded-md bg-elevated p-1"
                  aria-label={`Color ${c.name}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Quitar color"
                  onClick={() =>
                    patch({
                      colors: form.colors.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() =>
              patch({
                colors: [...form.colors, { name: "", hex: "#1A1A1A" } as ProductColor],
              })
            }
          >
            <Plus className="size-4" />
            Color
          </Button>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium tracking-wide text-muted uppercase">
            Fotos del producto
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.images.map((src, i) => (
              <div key={i} className="relative size-24">
                <ProductImage
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="size-24 rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-bg/80"
                  aria-label="Quitar foto"
                  onClick={() =>
                    patch({ images: form.images.filter((_, idx) => idx !== i) })
                  }
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <label className="mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-elevated px-3 text-sm shadow-[var(--shadow-border)]">
            <Upload className="size-4" />
            Subir foto
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => void onFiles(e.target.files)}
            />
          </label>
          <div className="mt-2 flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="O pega una URL de imagen"
            />
            <Button type="button" variant="secondary" onClick={addImageUrl}>
              Añadir
            </Button>
          </div>
        </fieldset>

        <Field label="Características (una por línea)" className="mt-6">
          <Textarea
            value={featureText}
            onChange={(e) => setFeatureText(e.target.value)}
            placeholder={"Secado rápido\nCosturas reforzadas"}
          />
        </Field>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium tracking-wide text-muted uppercase">
            Ficha técnica
          </legend>
          <div className="mt-3 space-y-2">
            {Object.entries(form.specs).map(([k, v], i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  value={k}
                  placeholder="Campo"
                  onChange={(e) => {
                    const entries = Object.entries(form.specs);
                    entries[i] = [e.target.value, v];
                    patch({ specs: Object.fromEntries(entries) });
                  }}
                />
                <Input
                  value={v}
                  placeholder="Valor"
                  onChange={(e) => {
                    const entries = Object.entries(form.specs);
                    entries[i] = [k, e.target.value];
                    patch({ specs: Object.fromEntries(entries) });
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => patch({ specs: { ...form.specs, "": "" } })}
          >
            <Plus className="size-4" />
            Campo
          </Button>
        </fieldset>

        <label className="mt-6 flex h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => patch({ featured: e.target.checked })}
            className="size-4 accent-primary"
          />
          Destacar en la portada
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            {editingId ? "Guardar cambios" : "Publicar en el catálogo"}
          </Button>
          {editingId ? (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancelar edición
            </Button>
          ) : null}
        </div>
      </form>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">
          Productos publicados ({products.length})
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4"
            >
              <ProductImage
                src={p.images[0]}
                alt=""
                className="size-14 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted">
                  {formatSoles(p.priceSoles)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar ${p.name}`}
                  onClick={() => startEdit(p)}
                >
                  <Pencil className="size-4" />
                </Button>
                {confirmId === p.id ? (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={busy}
                    onClick={() => void onDelete(p.id)}
                  >
                    Confirmar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Eliminar ${p.name}`}
                    onClick={() => setConfirmId(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
