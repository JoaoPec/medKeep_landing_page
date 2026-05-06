import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLoggerService } from '../services';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly loggerService: PinoLoggerService = new PinoLoggerService('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const response: FastifyReply = context.switchToHttp().getResponse();

    const startTime = Date.now();

    this.loggerService.log(`Incoming Request: ${request?.method} ${request?.url}`);

    if (!!request?.body) {
      this.loggerService.log(`Request Body: ${JSON.stringify(request.body)}`);
    }

    return next.handle().pipe(
      tap((data) => {
        const statusCode = response.statusCode;
        const endTime = Date.now();
        const duration = endTime - startTime;

        this.loggerService.log(
          `Outgoing Response: ${request?.method} ${request?.url} ${statusCode} - ${duration}ms`,
        );
        this.loggerService.log(`Response Body: ${JSON.stringify(data)}`);
      }),
    );
  }
}
