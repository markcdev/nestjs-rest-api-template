import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalDevelopmentGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const requestedUrl = this.getRequestedUrl(context);

    const isLocalDevelopment =
      this.configService.get<string>('NODE_ENV', { infer: true }) ===
      'development';

    if (!isLocalDevelopment) {
      throw new ForbiddenException(
        `Access to ${requestedUrl} is only allowed in development mode`,
      );
    }

    return of(true);
  }

  private getRequestedUrl(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();
    return request.url;
  }
}
