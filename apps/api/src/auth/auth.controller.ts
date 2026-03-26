// src/auth/auth.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterSelfDto } from './dto/register-self.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOperation({ summary: 'Customer self-registration (no partner)' })
    register(@Body() dto: RegisterSelfDto, @Req() req: Request) {
        return this.authService.registerSelf(dto, req);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiOperation({ summary: 'Login with userId + password (all roles)' })
    login(@Body() dto: LoginDto, @Req() req: Request) {
        return this.authService.login(dto, req);
    }

    @Public()
    @Get('activate')
    @ApiOperation({ summary: 'Activate account via email link (captures IP/geo)' })
    activate(@Query('token') token: string, @Req() req: Request) {
        return this.authService.activate(token, req);
    }

    @Public()
    @Post('set-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Set password after activation' })
    setPassword(@Body() dto: SetPasswordDto) {
        return this.authService.setPassword(dto);
    }
}