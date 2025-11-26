import {
  type ExplainResponse,
  type HealthcheckResponse,
  type HistoryItem,
  type MonitoringData,
  type PredictionResponse,
} from "./types"
import { type PatientFormValues } from "./patient"

export const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export async function predictPatient(
  data: PatientFormValues
): Promise<PredictionResponse> {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  })
  return handleResponse<PredictionResponse>(res)
}

export async function explainPatient(
  data: PatientFormValues
): Promise<ExplainResponse> {
  const res = await fetch(`${API_URL}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  })
  return handleResponse<ExplainResponse>(res)
}

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_URL}/history`, { cache: "no-store" })
  return handleResponse<HistoryItem[]>(res)
}

export async function getMonitoring(): Promise<MonitoringData> {
  const res = await fetch(`${API_URL}/monitoring`, { cache: "no-store" })
  return handleResponse<MonitoringData>(res)
}

export async function healthcheck(): Promise<HealthcheckResponse> {
  const res = await fetch(`${API_URL}/healthcheck`, { cache: "no-store" })
  return handleResponse<HealthcheckResponse>(res)
}
