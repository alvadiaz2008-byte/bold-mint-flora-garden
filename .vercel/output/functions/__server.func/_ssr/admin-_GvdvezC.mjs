import { o as __toESM } from "../_runtime.mjs";
import { i as sizesForCategory, r as formatSoles, t as CATEGORIES } from "./catalog-shared-Ul0nMdTI.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Trash2, n as Upload, o as Plus, s as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createProduct, d as logoutAdmin, f as updateProduct, i as Route$2, l as deleteProduct, o as Button, s as cn, u as loginAdmin } from "./router-gk9FQjnq.mjs";
import { t as Input } from "./input-RzaKQNIc.mjs";
import { t as ProductImage } from "./product-image-6D9kmQSq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-_GvdvezC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted uppercase", className),
		...props
	});
}
function AdminGate() {
	const router = useRouter();
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await loginAdmin({ data: { password } });
			await router.invalidate({ sync: true });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Contraseña incorrecta";
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-primary uppercase",
				children: "Menú de administrador"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold",
				children: "Acceso"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Introduce la contraseña para gestionar el catálogo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "mt-8 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "admin-password",
						children: "Contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "admin-password",
						type: "password",
						autoComplete: "current-password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: "Entrar"
				})]
			})
		]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full rounded-lg bg-elevated px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70", "disabled:opacity-40", className),
		...props
	});
}
async function fileToDataUrl(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No se pudo procesar la imagen");
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .72);
}
var emptyForm = (category = "uniformes") => ({
	sku: "",
	name: "",
	description: "",
	category,
	priceSoles: 0,
	sizes: [...sizesForCategory(category)],
	colors: [{
		name: "Olivo",
		hex: "#4B5320"
	}],
	images: [],
	material: "",
	weightG: null,
	features: [],
	specs: { Uso: "" },
	featured: false
});
function productToInput(p) {
	return {
		sku: p.sku,
		name: p.name,
		description: p.description,
		category: p.category,
		priceSoles: p.priceSoles,
		sizes: p.sizes,
		colors: p.colors.length ? p.colors : [{
			name: "Olivo",
			hex: "#4B5320"
		}],
		images: p.images,
		material: p.material,
		weightG: p.weightG,
		features: p.features,
		specs: Object.keys(p.specs).length ? p.specs : { Uso: "" },
		featured: p.featured
	};
}
function AdminPanel({ products }) {
	const router = useRouter();
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [featureText, setFeatureText] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const sizeOptions = (0, import_react.useMemo)(() => sizesForCategory(form.category), [form.category]);
	function patch(partial) {
		setForm((prev) => ({
			...prev,
			...partial
		}));
	}
	function startEdit(product) {
		setEditingId(product.id);
		setForm(productToInput(product));
		setFeatureText(product.features.join("\n"));
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	function resetForm() {
		setEditingId(null);
		setForm(emptyForm());
		setFeatureText("");
		setImageUrl("");
	}
	async function onFiles(files) {
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
	async function onSubmit(e) {
		e.preventDefault();
		const features = featureText.split("\n").map((s) => s.trim()).filter(Boolean);
		const specs = Object.fromEntries(Object.entries(form.specs).filter(([k, v]) => k.trim() && v.trim()));
		const payload = {
			...form,
			sku: form.sku.trim(),
			name: form.name.trim(),
			description: form.description.trim(),
			features,
			specs,
			priceSoles: Number(form.priceSoles),
			weightG: form.weightG === null || form.weightG === void 0 || Number.isNaN(form.weightG) ? null : Number(form.weightG)
		};
		setBusy(true);
		try {
			if (editingId) {
				await updateProduct({ data: {
					...payload,
					id: editingId
				} });
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
	async function onDelete(id) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.22em] text-primary uppercase",
						children: "Menú de administrador"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: editingId ? "Editar producto" : "Añadir producto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: "Completa los datos. Al guardar, el producto aparece de inmediato en el catálogo."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => void onLogout(),
					children: "Cerrar sesión"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nombre",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.name,
									onChange: (e) => patch({ name: e.target.value }),
									placeholder: "Camiseta táctica Dry-Fit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Referencia / SKU",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.sku,
									onChange: (e) => patch({ sku: e.target.value }),
									placeholder: "ATL-UNI-010"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Categoría",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
									value: form.category,
									onChange: (e) => {
										const category = e.target.value;
										patch({
											category,
											sizes: [...sizesForCategory(category)]
										});
									},
									children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.slug,
										children: c.label
									}, c.slug))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Precio (soles)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "number",
									min: "1",
									step: "0.01",
									value: form.priceSoles || "",
									onChange: (e) => patch({ priceSoles: Number(e.target.value) }),
									placeholder: "189.00"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Material",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.material,
									onChange: (e) => patch({ material: e.target.value }),
									placeholder: "Ripstop polialgodón"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Peso (gramos, opcional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "1",
									value: form.weightG ?? "",
									onChange: (e) => patch({ weightG: e.target.value ? Number(e.target.value) : null }),
									placeholder: "520"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Descripción",
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							required: true,
							minLength: 20,
							value: form.description,
							onChange: (e) => patch({ description: e.target.value }),
							placeholder: "Describe el uso, el tejido y los detalles de servicio."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-xs font-medium tracking-wide text-muted uppercase",
							children: "Tallas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: sizeOptions.map((s) => {
								const on = form.sizes.includes(s);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => patch({ sizes: on ? form.sizes.filter((x) => x !== s) : [...form.sizes, s] }),
									className: `flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm ${on ? "bg-primary text-primary-fg" : "bg-elevated text-fg shadow-[var(--shadow-border)]"}`,
									children: s
								}, s);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-xs font-medium tracking-wide text-muted uppercase",
								children: "Colores"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: form.colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: c.name,
											onChange: (e) => {
												const colors = [...form.colors];
												colors[i] = {
													...c,
													name: e.target.value
												};
												patch({ colors });
											},
											placeholder: "Nombre"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: c.hex,
											onChange: (e) => {
												const colors = [...form.colors];
												colors[i] = {
													...c,
													hex: e.target.value
												};
												patch({ colors });
											},
											className: "h-11 w-14 cursor-pointer rounded-md bg-elevated p-1",
											"aria-label": `Color ${c.name}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "icon",
											"aria-label": "Quitar color",
											onClick: () => patch({ colors: form.colors.filter((_, idx) => idx !== i) }),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "mt-3",
								onClick: () => patch({ colors: [...form.colors, {
									name: "",
									hex: "#1A1A1A"
								}] }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Color"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-xs font-medium tracking-wide text-muted uppercase",
								children: "Fotos del producto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: form.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative size-24",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
										src,
										alt: `Foto ${i + 1}`,
										className: "size-24 rounded-md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-bg/80",
										"aria-label": "Quitar foto",
										onClick: () => patch({ images: form.images.filter((_, idx) => idx !== i) }),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-elevated px-3 text-sm shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
									"Subir foto",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										multiple: true,
										className: "sr-only",
										onChange: (e) => void onFiles(e.target.files)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: imageUrl,
									onChange: (e) => setImageUrl(e.target.value),
									placeholder: "O pega una URL de imagen"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: addImageUrl,
									children: "Añadir"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Características (una por línea)",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: featureText,
							onChange: (e) => setFeatureText(e.target.value),
							placeholder: "Secado rápido\nCosturas reforzadas"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-xs font-medium tracking-wide text-muted uppercase",
								children: "Ficha técnica"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: Object.entries(form.specs).map(([k, v], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: k,
										placeholder: "Campo",
										onChange: (e) => {
											const entries = Object.entries(form.specs);
											entries[i] = [e.target.value, v];
											patch({ specs: Object.fromEntries(entries) });
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: v,
										placeholder: "Valor",
										onChange: (e) => {
											const entries = Object.entries(form.specs);
											entries[i] = [k, e.target.value];
											patch({ specs: Object.fromEntries(entries) });
										}
									})]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "mt-3",
								onClick: () => patch({ specs: {
									...form.specs,
									"": ""
								} }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Campo"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-6 flex h-11 items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.featured,
							onChange: (e) => patch({ featured: e.target.checked }),
							className: "size-4 accent-primary"
						}), "Destacar en la portada"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: editingId ? "Guardar cambios" : "Publicar en el catálogo"
						}), editingId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: resetForm,
							children: "Cancelar edición"
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-semibold",
					children: [
						"Productos publicados (",
						products.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
					children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
								src: p.images[0],
								alt: "",
								className: "size-14 rounded-md"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										p.sku,
										" · ",
										formatSoles(p.priceSoles)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									"aria-label": `Editar ${p.name}`,
									onClick: () => startEdit(p),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
								}), confirmId === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "danger",
									size: "sm",
									disabled: busy,
									onClick: () => void onDelete(p.id),
									children: "Confirmar"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									"aria-label": `Eliminar ${p.name}`,
									onClick: () => setConfirmId(p.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})
						]
					}, p.id))
				})]
			})
		]
	});
}
function Field({ label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `flex flex-col gap-2 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function AdminPage() {
	const { ok, products } = Route$2.useLoaderData();
	if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGate, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, { products });
}
//#endregion
export { AdminPage as component };
