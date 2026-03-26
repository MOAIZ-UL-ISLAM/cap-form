// src/users/users.controller.ts
import {
    Body, Controller, Delete, Get, HttpCode,
    HttpStatus, Param, Patch, Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Role } from 'generated/prisma/client/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Partner, Manager, SuperAdmin can create users
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER)
    @ApiOperation({ summary: 'Create a user (role-restricted)' })
    create(@GetUser() actor: JwtPayload, @Body() dto: CreateUserDto) {
        return this.usersService.createUser(actor, dto);
    }

    // List users (scoped by role)
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER)
    @ApiOperation({ summary: 'List users (scoped to actor role)' })
    list(@GetUser() actor: JwtPayload) {
        return this.usersService.listUsers(actor);
    }

    // Get single user
    @Get(':userId')
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Get user by userId' })
    getOne(@GetUser() actor: JwtPayload, @Param('userId') userId: string) {
        return this.usersService.getUser(actor, userId);
    }

    // Update user
    @Patch(':userId')
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Update user' })
    update(
        @GetUser() actor: JwtPayload,
        @Param('userId') userId: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(actor, userId, dto);
    }

    // Delete (SuperAdmin only)
    @Delete(':userId')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete user (SuperAdmin only)' })
    remove(@GetUser() actor: JwtPayload, @Param('userId') userId: string) {
        return this.usersService.deleteUser(actor, userId);
    }

    // Audit logs (SuperAdmin only)
    @Get('admin/audit-logs')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get full audit log (SuperAdmin only)' })
    auditLogs(@GetUser() actor: JwtPayload) {
        return this.usersService.getAuditLogs(actor);
    }
}