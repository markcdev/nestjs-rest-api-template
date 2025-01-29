import { utilities, WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

export const loggingModuleOptions: WinstonModuleOptions = {
  transports: new transports.Console(),
  format: format.combine(
    format.timestamp({ format: 'DD/MM/YYYYTHH:mm:ss,SS' }),
    format.errors({ stack: true }),
    utilities.format.nestLike('NestJS Rest API Template', {
      appName: true,
      colors: true,
      prettyPrint: true,
      processId: true,
    }),
  ),
};
