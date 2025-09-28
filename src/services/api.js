// src/api.js

//REACT_APP_BACKEND_URL=https:https://betabakend-gimichat-1.onrender.com
export const API_BASE =
  (typeof process !== "undefined" && process?.env?.REACT_APP_BACKEND_URL) ||
  (typeof import !== "undefined" && typeof import.meta !== "undefined" && import.meta?.env?.VITE_BACKEND_URL) ||
  "";

// Utilidad para manejar errores de fetch de manera uniforme
async function handleResponse(res) {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      // cuerpo no JSON, mantenemos msg por defecto
    }
    throw new Error(msg);
  }
  // Si no hay contenido (204) o no es JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    try {
      const text = await res.text();
      return { ok: true, text };
    } catch {
      return { ok: true };
    }
  }
  return res.json();
}

// Salud del backend (útil para probar conexión rápida)
export async function getHealth() {
  if (!API_BASE) throw new Error("No se detectó la URL del backend (API_BASE vacío). Revisa tus variables de entorno.");
  const res = await fetch(`${API_BASE}/health`, { credentials: "omit" });
  return handleResponse(res);
}

// Ejemplo: buscar empleado por cédula (ajusta la ruta si tu backend difiere)
export async function buscarEmpleado(cedula) {
  if (!API_BASE) throw new Error("No se detectó la URL del backend (API_BASE vacío).");
  const res = await fetch(`${API_BASE}/empleados/${encodeURIComponent(cedula)}`, {
    credentials: "omit",
  });
  return handleResponse(res);
}

// Ejemplo: enviar incapacidad (ajusta la ruta/estructura al backend real)
export async function enviarIncapacidad(payload) {
  if (!API_BASE) throw new Error("No se detectó la URL del backend (API_BASE vacío).");
  const res = await fetch(`${API_BASE}/incapacidades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "omit",
  });
  return handleResponse(res);
}
