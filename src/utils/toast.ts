let container: HTMLDivElement | null = null;

function ensureContainer() {
  if (typeof document === "undefined") return null;
  if (container && document.body.contains(container)) return container;
  container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "12px";
  container.style.right = "12px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "8px";
  container.style.zIndex = "2147483647";
  document.body.appendChild(container);
  return container;
}

function pushToast(text: string, kind: "success"|"error"|"loading") {
  const root = ensureContainer();
  if (!root) { try { alert(text); } catch {} return undefined; }
  const el = document.createElement("div");
  el.textContent = text;
  el.style.padding = "10px 12px";
  el.style.borderRadius = "10px";
  el.style.fontSize = "13px";
  el.style.boxShadow = "0 8px 24px rgba(0,0,0,.35)";
  el.style.opacity = "0";
  el.style.transform = "translateY(-6px)";
  el.style.transition = "all .18s ease";
  el.style.color = kind === "error" ? "#ffd7d7" : kind === "loading" ? "#d7eaff" : "#eaffea";
  el.style.background = kind === "error" ? "rgba(192,32,32,.9)" : kind === "loading" ? "rgba(24,96,160,.9)" : "rgba(24,128,64,.9)";
  root.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
  const id = "t" + Date.now() + Math.random().toString(36).slice(2);
  (el as any).__id = id;
  if (kind !== "loading") setTimeout(() => removeToast(id), 2500);
  return id;
}

function removeToast(id?: string) {
  if (!container) return;
  const el = Array.from(container.children).find((n) => (n as any).__id === id) as HTMLDivElement | undefined;
  if (!el) return;
  el.style.opacity = "0";
  el.style.transform = "translateY(-6px)";
  setTimeout(() => { try { el.remove(); } catch {} }, 180);
}

export const showSuccess = (message: string) => { pushToast(message, "success"); };
export const showError = (message: string) => { pushToast(message, "error"); };
export const showLoading = (message: string) => pushToast(message, "loading") as string | undefined;
export const dismissToast = (toastId: string) => removeToast(toastId);
