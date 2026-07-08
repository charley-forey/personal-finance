import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../services/core.services';
import { AuthGuard, RolesGuard } from '../../common/auth.guard';

@Global()
@Module({
  providers: [
    AuthService,
    {
      provide: AuthGuard,
      useFactory: (config: ConfigService, reflector: Reflector, authService: AuthService) =>
        new AuthGuard(config, reflector, authService),
      inject: [ConfigService, Reflector, AuthService],
    },
    {
      provide: RolesGuard,
      useFactory: (reflector: Reflector) => new RolesGuard(reflector),
      inject: [Reflector],
    },
  ],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
