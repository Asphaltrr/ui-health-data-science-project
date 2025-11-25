export interface PredictionResponse {
  prediction: number;
  proba_survie: number;
  proba_deces: number;
  top_features: string[];
}

export interface ExplainResponse {
  prediction: number;
  base_value: number;
  contributions: Record<string, number>;
  top_features: string[];
}

export interface HistoryItem {
  id: number;
  timestamp: string;
  input: Record<string, unknown>;
  prediction: number;
  proba_survie: number;
  proba_deces: number;
}

export interface MonitoringData {
  n_predictions: number;
  predictions_per_day: Record<string, number>;
  class_rate: Record<string, number>;
  training_class_balance?: Record<string, number>;
  feature_stats_live: Record<
    string,
    { mean: number | null; std: number | null; min: number | null; max: number | null }
  >;
  feature_drift_psi?: Record<string, number | null>;
}

export interface HealthcheckResponse {
  status: string;
  model_loaded: boolean;
  latency_ms: number;
}
