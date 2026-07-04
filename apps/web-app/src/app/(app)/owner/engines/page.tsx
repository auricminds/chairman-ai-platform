"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface Engine {
  id: string;
  internal_key: string;
  owner_name: string;
  chairman_mode: string;
  provider: string;
  provider_model_id: string;
  enabled: boolean;
  priority: number;
  allowed_plans: string[];
  max_input_tokens: number;
  max_output_tokens: number;
  input_price_per_million: number;
  output_price_per_million: number;
  requires_confirmation: boolean;
  owner_notes: string;
}

export default function OwnerEnginesPage() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchEngines = async () => {
    const supabase = getSupabaseBrowserClient();
    // Owner can read all engines directly via service role session
    const { data, error: fetchError } = await supabase
      .from("engine_registry")
      .select("*")
      .order("chairman_mode");

    if (fetchError) {
      setError("Failed to load engines. Check your role.");
    } else {
      setEngines((data as Engine[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchEngines();
  }, []);

  const toggleEngine = async (engine: Engine) => {
    setSaving(engine.id);
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase
      .from("engine_registry")
      .update({
        enabled: !engine.enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", engine.id);

    if (updateError) {
      setError(`Failed to update ${engine.internal_key}: ${updateError.message}`);
    } else {
      setEngines((prev) =>
        prev.map((e) => e.id === engine.id ? { ...e, enabled: !e.enabled } : e)
      );
    }
    setSaving(null);
  };

  const updateModelId = async (engineId: string, modelId: string) => {
    setSaving(engineId);
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase
      .from("engine_registry")
      .update({ provider_model_id: modelId, updated_at: new Date().toISOString() })
      .eq("id", engineId);

    if (updateError) {
      setError(`Failed to update model ID: ${updateError.message}`);
    } else {
      setEngines((prev) =>
        prev.map((e) => e.id === engineId ? { ...e, provider_model_id: modelId } : e)
      );
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Engine Control</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Owner-only. Enable, disable, and configure AI engines per mode.
          Model IDs and provider details are never shown to customers.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {engines.map((engine) => (
          <EngineCard
            key={engine.id}
            engine={engine}
            saving={saving === engine.id}
            onToggle={() => void toggleEngine(engine)}
            onUpdateModelId={(id) => void updateModelId(engine.id, id)}
          />
        ))}
      </div>
    </div>
  );
}

function EngineCard({
  engine,
  saving,
  onToggle,
  onUpdateModelId,
}: {
  engine: Engine;
  saving: boolean;
  onToggle: () => void;
  onUpdateModelId: (id: string) => void;
}) {
  const [modelInput, setModelInput] = useState(engine.provider_model_id);
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-100">{engine.owner_name}</span>
            <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded font-mono">
              {engine.chairman_mode}
            </span>
            <span className={[
              "text-[10px] px-1.5 py-0.5 rounded border",
              engine.enabled
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                : "bg-zinc-800 text-zinc-600 border-zinc-700",
            ].join(" ")}>
              {engine.enabled ? "ENABLED" : "DISABLED"}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-xs text-zinc-500">
            <p>Plans: {engine.allowed_plans.join(", ") || "none"}</p>
            <p>
              Max tokens: {engine.max_input_tokens.toLocaleString()} in /{" "}
              {engine.max_output_tokens.toLocaleString()} out
            </p>
            {engine.owner_notes && (
              <p className="text-zinc-600 italic">{engine.owner_notes}</p>
            )}
          </div>

          {/* Model ID editor */}
          <div className="mt-3 flex items-center gap-2">
            {editing ? (
              <>
                <input
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder="provider/model-id"
                  className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-600 w-72"
                />
                <button
                  onClick={() => {
                    onUpdateModelId(modelInput);
                    setEditing(false);
                  }}
                  disabled={saving}
                  className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setModelInput(engine.provider_model_id); }}
                  className="px-2.5 py-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-xs font-mono text-zinc-600">
                  {engine.provider_model_id || "(no model set)"}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-zinc-500 hover:text-amber-400 transition-colors underline underline-offset-2"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          disabled={saving || !engine.provider_model_id}
          title={!engine.provider_model_id ? "Set a model ID before enabling" : undefined}
          className={[
            "flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
            engine.enabled
              ? "bg-red-950/40 text-red-400 border-red-900 hover:bg-red-950/70"
              : "bg-emerald-950/40 text-emerald-400 border-emerald-900 hover:bg-emerald-950/70",
          ].join(" ")}
        >
          {saving ? "..." : engine.enabled ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
