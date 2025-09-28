// src/App.js
import React, { useMemo, useState } from "react";
import { API_BASE, getHealth, enviarIncapacidad } from "./api";

export default function App() {
  const [incapacityType, setIncapacityType] = useState(""); // paternidad | accidente_transito | otros
  const [specificFields, setSpecificFields] = useState({
    motherWorks: false,        // <— booleano para paternidad
    vehiculoFantasma: false,   // <— booleano para accidente de tránsito
  });

  const [apiStatus, setApiStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  // ---- LÓGICA DE DOCUMENTOS ----
  const docsPaternity = (motherWorks) => {
    const docs = [
      "Epicrisis o resumen clínico",
      "Cédula del padre",
      "Registro civil",
      "Certificado de nacido vivo",
    ];
    if (motherWorks) {
      docs.push("Licencia o incapacidad de maternidad");
    }
    return docs;
  };

  const docsTransit = (vehiculoFantasma) => {
    const base = ["Incapacidad médica", "Epicrisis o resumen clínico", "FURIPS"];
    if (!vehiculoFantasma) base.push("SOAT");
    return base;
  };

  const requiredDocs = useMemo(() => {
    if (incapacityType === "paternidad") return docsPaternity(specificFields.motherWorks);
    if (incapacityType === "accidente_transito") return docsTransit(specificFields.vehiculoFantasma);
    return [];
  }, [incapacityType, specificFields]);

  // ---- EVENTOS ----
  const handleChangeType = (e) => {
    const value = e.target.value;
    setIncapacityType(value);
  };

  const testApi = async () => {
    setApiStatus("checking");
    setResultMsg("");
    try {
      const health = await getHealth();
      setApiStatus("ok");
      setResultMsg(
        `Conectado a: ${API_BASE || "(sin API_BASE)"} — Respuesta /health: ${JSON.stringify(health)}`
      );
    } catch (err) {
      setApiStatus("error");
      setResultMsg(
        `Fallo conexión a: ${API_BASE || "(sin API_BASE)"} — Detalle: ${err?.message || err}`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResultMsg("");
    try {
      const payload = {
        type: incapacityType,
        motherWorks: specificFields.motherWorks,
        vehiculoFantasma: specificFields.vehiculoFantasma,
        // agrega aquí otros campos de tu formulario...
      };
      const resp = await enviarIncapacidad(payload);
      setResultMsg(`Enviado con éxito: ${JSON.stringify(resp)}`);
    } catch (err) {
      setResultMsg(`Error al enviar: ${err?.message || err}`);
    } finally {
      setSending(false);
    }
  };

  // ---- UI ----
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Incapacidades</h1>

      <div className="mb-4 text-sm">
        <div className="opacity-70">API_BASE detectado:</div>
        <div className="font-mono break-all">{API_BASE || "No definido (revisa .env)"}</div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={testApi}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Probar conexión API (/health)
        </button>
        {apiStatus === "checking" && <span>Probando...</span>}
        {apiStatus === "ok" && <span className="text-green-600">Conectado ✅</span>}
        {apiStatus === "error" && <span className="text-red-600">Error ❌</span>}
      </div>

      {resultMsg && (
        <div className="mb-6 p-3 rounded bg-gray-100 border">
          <pre className="whitespace-pre-wrap break-words text-sm">{resultMsg}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de incapacidad */}
        <div>
          <label className="block mb-1 font-medium">Tipo de incapacidad</label>
          <select
            value={incapacityType}
            onChange={handleChangeType}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Selecciona una opción</option>
            <option value="paternidad">Licencia de paternidad</option>
            <option value="accidente_transito">Accidente de tránsito</option>
            {/* agrega otros tipos si los necesitas */}
          </select>
        </div>

        {/* Condicional: Paternidad -> ¿Madre laborando? */}
        {incapacityType === "paternidad" && (
          <div>
            <span className="block mb-1 font-medium">¿La madre se encuentra laborando?</span>
            <div className="flex gap-6 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="motherWorks"
                  checked={specificFields.motherWorks === true}
                  onChange={() =>
                    setSpecificFields((s) => ({ ...s, motherWorks: true }))
                  }
                />
                <span className="ml-2">Sí</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="motherWorks"
                  checked={specificFields.motherWorks === false}
                  onChange={() =>
                    setSpecificFields((s) => ({ ...s, motherWorks: false }))
                  }
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        )}

        {/* Condicional: Accidente de tránsito -> ¿Vehículo fantasma? */}
        {incapacityType === "accidente_transito" && (
          <div>
            <span className="block mb-1 font-medium">¿Vehículo fantasma?</span>
            <div className="flex gap-6 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="vehiculoFantasma"
                  checked={specificFields.vehiculoFantasma === true}
                  onChange={() =>
                    setSpecificFields((s) => ({ ...s, vehiculoFantasma: true }))
                  }
                />
                <span className="ml-2">Sí</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="vehiculoFantasma"
                  checked={specificFields.vehiculoFantasma === false}
                  onChange={() =>
                    setSpecificFields((s) => ({ ...s, vehiculoFantasma: false }))
                  }
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        )}

        {/* Vista previa de documentos requeridos */}
        <div>
          <span className="block mb-1 font-medium">Documentos requeridos</span>
          {requiredDocs.length === 0 ? (
            <div className="text-sm opacity-70">
              Selecciona un tipo de incapacidad para ver los documentos.
            </div>
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {requiredDocs.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Enviar ejemplo */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!incapacityType || sending}
            className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
          >
            {sending ? "Enviando..." : "Enviar ejemplo"}
          </button>
          {!incapacityType && (
            <span className="text-sm opacity-70">
              Selecciona un tipo de incapacidad para habilitar el envío.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
