export interface HealthCheckResult {
  status: 'ok' | 'error';
  service: string;
  version?: string;
  uptime?: number;
}
