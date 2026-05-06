import { Injectable, LoggerService, Optional } from '@nestjs/common';

import pino, { LogDescriptor, Logger } from 'pino';
// import pinoElastic, { DestinationStream } from 'pino-elasticsearch';
import pinoPretty from 'pino-pretty';
import { getColorFromLevel, timeFormatter } from '../helpers';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(
    @Optional()
    protected context: string = 'Nest',
  ) {
    // const configService: ConfigService = new ConfigService();

    // const streamToElastic: DestinationStream = pinoElastic({
    //   index: configService.getOrThrow<string>('PINO_ELASTIC_INDEX'),
    //   node: configService.getOrThrow<string>('ELASTICSEARCH_URL'), // Replace with your OpenSearch endpoint
    //   auth: {
    //     username: configService.getOrThrow<string>('ELASTICSEARCH_USERNAME'),
    //     password: configService.getOrThrow<string>('ELASTICSEARCH_PASSWORD'),
    //   },
    //   esVersion: 7, // Specify the Elasticsearch version
    //   flushBytes: 1000, // Optional: customize the buffer size
    // });
    const prettyStream: pinoPretty.PrettyStream = pinoPretty({
      //   destination: 1,
      singleLine: true,
      colorize: true,
      customColors: {
        trace: 'cyan',
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
      },
      ignore: 'pid,hostname,level,time,context',
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      messageFormat: (log: LogDescriptor) => {
        const color: string = getColorFromLevel(log.level);
        return `${color}[${log.context}] - \x1B[37m${timeFormatter.format(log.time).replaceAll(',', ':')} ${color}- \x1B[37m${log.msg}`;
      },
    });

    this.logger = pino(
      {
        formatters: {
          bindings: (bindings) => ({
            pid: bindings.pid,
            hostname: bindings.hostname,
            context,
          }),
        },
      },
      pino.multistream([{ stream: prettyStream }]),
      // pino.multistream([{ stream: prettyStream }, { stream: streamToElastic }]),
    );
  }

  log(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: [...any, string?]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: [...any, string?]) {
    this.logger.trace(message, ...optionalParams);
  }
}
