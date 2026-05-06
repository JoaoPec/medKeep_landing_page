import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ActivityLogConfigShape } from '../config';
import { buildActorFromAuthToken } from '../helpers';
import type { AuthTokenPayload } from '../../auth/interfaces/auth-token-payload.interface';
import { EnqueueActivityLogUseCase } from '../use-cases/enqueue-activity-log.use-case';

@Injectable()
export class ActivityLogHttpInterceptor implements NestInterceptor {
  constructor(
    private readonly enqueueActivityLogUseCase: EnqueueActivityLogUseCase,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const cfg = this.configService.get<ActivityLogConfigShape>('activityLog');
    if (!cfg || !cfg.enabled) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<{
      method?: string;
      url?: string;
      ip?: string;
      user?: AuthTokenPayload;
      headers?: { 'x-forwarded-for'?: string };
    }>();
    const started = Date.now();

    const actor =
      request.user != null
        ? buildActorFromAuthToken(request.user, {
            ipAddress: request.ip ?? request.headers?.['x-forwarded-for']?.split(',')[0]?.trim(),
          })
        : null;

    const ip =
      actor?.ipAddress ??
      request.ip ??
      request.headers?.['x-forwarded-for']?.split(',')[0]?.trim();

    return next.handle().pipe(
      map((data) => {
        if (cfg.httpEnabled) {
          const durationMs = Date.now() - started;
          void this.enqueueActivityLogUseCase.execute({
            userType: actor?.userType ?? 'system',
            userId: actor?.userId,
            userName: actor?.userName,
            userAvatar: actor?.userAvatar,
            ipAddress: ip,
            level: 'success',
            category: 'system',
            action: 'http_request',
            description: `${request.method ?? '?'} ${request.url ?? '?'} concluido`,
            metadata: {
              durationMs,
            },
          });
        }
        return data;
      }),
    );
  }
}
