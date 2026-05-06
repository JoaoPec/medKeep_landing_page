export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpirationMs: number;
  refreshTokenExpirationMs: number;
}
