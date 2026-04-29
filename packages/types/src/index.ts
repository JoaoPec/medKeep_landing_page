/** Tipos/contratos partilhados entre apps — alinhar com API quando existirem endpoints reais */

export interface HealthCheckResponseDto {
  status: "ok" | "degraded" | "error";
  version?: string;
  timestamp: string;
}

export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
