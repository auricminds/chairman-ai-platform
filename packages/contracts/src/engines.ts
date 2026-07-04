export interface EngineRecord {
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
  input_price_per_million: number;  // microUSD internally
  output_price_per_million: number;
  fallback_engine_key: string | null;
  requires_confirmation: boolean;
  updated_at: string;
  owner_notes: string;
}
