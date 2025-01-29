import { ConfigModuleOptions } from '@nestjs/config';

import { appConfigSchema } from './config.schema';

export const configModuleOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  validate: (env) => appConfigSchema.parse(env),
};
