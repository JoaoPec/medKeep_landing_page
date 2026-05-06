import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { I18nValidationException, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { EnqueueActivityLogUseCase } from '../use-cases/enqueue-activity-log.use-case';

/**
 * Regista erros na fila de activity log e delega respostas HTTP.
 *
 * **Importante:** `I18nValidationExceptionFilter` só pode receber `I18nValidationException`
 * (usa `exc.getResponse()` / `getStatus()` assumindo `HttpException`). Antigas versões
 * delegavam qualquer erro → `exc.getStatus is not a function` para erros genéricos.
 */
@Catch()
export class ActivityLogExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ActivityLogExceptionFilter.name);

  constructor(
    private readonly enqueueActivityLogUseCase: EnqueueActivityLogUseCase,
    private readonly delegate: I18nValidationExceptionFilter,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ method?: string; url?: string }>();
    const response = ctx.getResponse<{ header: (k: string, v: string) => void; status: (c: number) => { send: (b: unknown) => void } }>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : String(exception);

    void this.enqueueActivityLogUseCase.execute({
      userType: 'system',
      level: 'error',
      category: 'system',
      action: 'http_exception',
      description: message,
      metadata: {
        statusCode: status,
        path: request?.url,
        method: request?.method,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    });

    if (exception instanceof I18nValidationException) {
      this.delegate.catch(exception, host);
      return;
    }

    if (exception instanceof HttpException) {
      const st = exception.getStatus();
      const payload = exception.getResponse();

      if (st >= 500) {
        const ref = randomUUID();
        this.logger.error(
          {
            ref,
            path: request?.url,
            method: request?.method,
            stack: exception instanceof Error ? exception.stack : undefined,
            payload,
          },
          message,
        );
        response.header('X-Error-Ref', ref);
        response.status(st).send({
          statusCode: st,
          message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
          error: 'Internal Server Error',
          errorRef: ref,
        });
        return;
      }

      response.status(st).send(payload);
      return;
    }

    const ref = randomUUID();
    this.logger.error(
      {
        ref,
        path: request?.url,
        method: request?.method,
        stack: exception instanceof Error ? exception.stack : undefined,
        exception,
      },
      'Excepção não tratada (não HTTP)',
    );
    response.header('X-Error-Ref', ref);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
      error: 'Internal Server Error',
      errorRef: ref,
    });
  }
}
