// src/users/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail, IsEnum, IsNotEmpty,
    IsOptional, IsString, Matches, MaxLength, ValidateIf,
} from 'class-validator';
import {
    TitleEnum,
    GenderEnum,
    CountryEnum,
    DebtRangeEnum,
    Role,
} from '../../common/constants/enums';
import { RequireDebtRangeForCustomer } from '../validators/role-creation.validator';

export class CreateUserDto {
    // ── Role — determines which fields become mandatory ──────────────────────
    @ApiProperty({ enum: Role })
    @IsEnum(Role)
    role: Role;

    // ── Always required ───────────────────────────────────────────────────────
    @ApiProperty()
    @IsString() @IsNotEmpty() @MaxLength(50)
    firstName: string;

    @ApiProperty()
    @IsString() @IsNotEmpty() @MaxLength(50)
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    // ── Required for CUSTOMER only ────────────────────────────────────────────
    @ApiPropertyOptional({ enum: TitleEnum })
    @ValidateIf((o: CreateUserDto) => o.role === Role.CUSTOMER)
    @IsEnum(TitleEnum)
    title?: TitleEnum;

    @ApiPropertyOptional({ enum: GenderEnum })
    @ValidateIf((o: CreateUserDto) => o.role === Role.CUSTOMER)
    @IsEnum(GenderEnum)
    gender?: GenderEnum;

    @ApiPropertyOptional({ example: '+447911123456' })
    @ValidateIf((o: CreateUserDto) => o.role === Role.CUSTOMER)
    @IsString()
    @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number' })
    phone?: string;

    @ApiPropertyOptional({ enum: CountryEnum })
    @ValidateIf((o: CreateUserDto) => o.role === Role.CUSTOMER)
    @IsEnum(CountryEnum)
    country?: CountryEnum;

    @ApiPropertyOptional({ enum: DebtRangeEnum })
    @RequireDebtRangeForCustomer()         // custom validator
    @ValidateIf((o: CreateUserDto) => o.role === Role.CUSTOMER)
    @IsEnum(DebtRangeEnum)
    debtRange?: DebtRangeEnum;

    // ── Optional for all ──────────────────────────────────────────────────────
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;
}