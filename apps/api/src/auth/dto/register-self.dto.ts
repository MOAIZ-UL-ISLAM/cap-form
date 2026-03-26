// src/auth/dto/register-self.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsEnum, IsNotEmpty,
    IsString, Matches, MaxLength, MinLength,
} from 'class-validator';
import {
    TitleEnum, GenderEnum, CountryEnum, DebtRangeEnum,
} from '../../common/constants/enums';
import { Match } from '../../common/decorators/match.decorator';

export class RegisterSelfDto {
    @ApiProperty({ enum: TitleEnum })
    @IsEnum(TitleEnum)
    title: TitleEnum;

    @ApiProperty()
    @IsString() @IsNotEmpty() @MaxLength(50)
    firstName: string;

    @ApiProperty()
    @IsString() @IsNotEmpty() @MaxLength(50)
    lastName: string;

    @ApiProperty({ enum: GenderEnum })
    @IsEnum(GenderEnum)
    gender: GenderEnum;

    @ApiProperty({ example: '+447911123456' })
    @IsString()
    @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number' })
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ enum: CountryEnum })
    @IsEnum(CountryEnum)
    country: CountryEnum;

    @ApiProperty({ enum: DebtRangeEnum })
    @IsEnum(DebtRangeEnum)
    debtRange: DebtRangeEnum;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8) @MaxLength(64)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must include uppercase, lowercase, number and special character',
    })
    password: string;

    @ApiProperty()
    @IsString() @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}