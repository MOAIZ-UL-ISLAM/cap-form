// src/forms/customer-start/customer-start.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Role } from '../../../generated/prisma/client/enums';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { CustomerStartService } from './customer-start.service';
import { CreateCustomerStartDto } from './dto/create-customer-start.dto';
import { UpdateCustomerStartDto } from './dto/update-customer-start.dto';

@ApiTags('Forms / Customer Start')
@ApiBearerAuth()
@Controller('forms/customer-start')
export class CustomerStartController {
    constructor(private readonly service: CustomerStartService) { }

    /**
     * POST /forms/customer-start/:customerUserId
     * Create start form for a customer.
     * Actor: SUPER_ADMIN | MANAGER | PARTNER (if their customer) | CUSTOMER (own)
     */
    @Post(':customerUserId')
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Create customer start form' })
    @ApiParam({ name: 'customerUserId', example: 'TIGCAP1234567' })
    create(
        @GetUser() actor: JwtPayload,
        @Param('customerUserId') customerUserId: string,
        @Body() dto: CreateCustomerStartDto,
    ) {
        return this.service.create(actor, customerUserId, dto);
    }

    /**
     * GET /forms/customer-start
     * List all forms visible to the actor.
     * SUPER_ADMIN / MANAGER → all forms
     * PARTNER → only their customers' forms (non-submitted)
     * CUSTOMER → forbidden (use GET /:customerUserId)
     */
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER)
    @ApiOperation({ summary: 'List all start forms (role-scoped)' })
    findAll(@GetUser() actor: JwtPayload) {
        return this.service.findAll(actor);
    }

    /**
     * GET /forms/customer-start/:customerUserId
     * Get a specific customer's start form.
     */
    @Get(':customerUserId')
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Get start form for a specific customer' })
    @ApiParam({ name: 'customerUserId', example: 'TIGCAP1234567' })
    findOne(
        @GetUser() actor: JwtPayload,
        @Param('customerUserId') customerUserId: string,
    ) {
        return this.service.findByCustomer(actor, customerUserId);
    }

    /**
     * PATCH /forms/customer-start/:customerUserId
     * Partial update — used for auto-save on frontend.
     */
    @Patch(':customerUserId')
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Update (auto-save) customer start form' })
    @ApiParam({ name: 'customerUserId', example: 'TIGCAP1234567' })
    update(
        @GetUser() actor: JwtPayload,
        @Param('customerUserId') customerUserId: string,
        @Body() dto: UpdateCustomerStartDto,
    ) {
        return this.service.update(actor, customerUserId, dto);
    }

    /**
     * POST /forms/customer-start/:customerUserId/submit
     * Lock and submit the form.
     * After this: partner loses access, PDF generation triggers.
     */
    @Post(':customerUserId/submit')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.PARTNER, Role.CUSTOMER)
    @ApiOperation({ summary: 'Submit the start form (locks it)' })
    @ApiParam({ name: 'customerUserId', example: 'TIGCAP1234567' })
    submit(
        @GetUser() actor: JwtPayload,
        @Param('customerUserId') customerUserId: string,
        @Req() req: Request,
    ) {
        return this.service.submit(actor, customerUserId, req);
    }

    /**
     * DELETE /forms/customer-start/:customerUserId
     * Hard delete — SuperAdmin only.
     */
    @Delete(':customerUserId')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete start form (SuperAdmin only)' })
    @ApiParam({ name: 'customerUserId', example: 'TIGCAP1234567' })
    remove(
        @GetUser() actor: JwtPayload,
        @Param('customerUserId') customerUserId: string,
    ) {
        return this.service.remove(actor, customerUserId);
    }
}