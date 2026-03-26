// src/users/dto/update-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail, IsEnum, IsOptional,
    IsString, Matches, MaxLength,
} from 'class-validator';
import {
    TitleEnum, GenderEnum, CountryEnum, DebtRangeEnum,
} from '../../common/constants/enums';

export class UpdateUserDto {
    @ApiPropertyOptional({ enum: TitleEnum })
    @IsOptional() @IsEnum(TitleEnum)
    title?: TitleEnum;

    @ApiPropertyOptional()
    @IsOptional() @IsString() @MaxLength(50)
    firstName?: string;

    @ApiPropertyOptional()
    @IsOptional() @IsString() @MaxLength(50)
    lastName?: string;

    @ApiPropertyOptional({ enum: GenderEnum })
    @IsOptional() @IsEnum(GenderEnum)
    gender?: GenderEnum;

    @ApiPropertyOptional()
    @IsOptional() @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number' })
    phone?: string;

    @ApiPropertyOptional({ enum: CountryEnum })
    @IsOptional() @IsEnum(CountryEnum)
    country?: CountryEnum;

    @ApiPropertyOptional({ enum: DebtRangeEnum })
    @IsOptional() @IsEnum(DebtRangeEnum)
    debtRange?: DebtRangeEnum;

    @ApiPropertyOptional()
    @IsOptional() @IsString()
    companyName?: string;

    // SuperAdmin only — reassign customer's partner
    @ApiPropertyOptional()
    @IsOptional() @IsString()
    partnerId?: string;
}