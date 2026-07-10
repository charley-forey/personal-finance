import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../services/core.services';
import { ApiKeyService } from '../../services/platform.services';
import { AuthGuard, RolesGuard } from '../../common/auth.guard';

@Global()
@Module({
  providers: [
    AuthService,
    ApiKeyService,
    {
      provide: AuthGuard,
      useFactory: (
        config: ConfigService,
        reflector: Reflector,
        authService: AuthService,
        apiKeys: ApiKeyService,
      ) => new AuthGuard(config, reflector, authService, apiKeys),
      inject: [ConfigService, Reflector, AuthService, ApiKeyService],
    },
    {
      provide: RolesGuard,
      useFactory: (reflector: Reflector) => new RolesGuard(reflector),
      inject: [Reflector],
    },
  ],
  exports: [AuthService, AuthGuard, RolesGuard, ApiKeyService],
})
export class AuthModule {}
