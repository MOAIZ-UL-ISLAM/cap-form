// apps/api/src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export enum TitleEnum {
    MR = 'MR',
    MRS = 'MRS',
    MS = 'MS',
    DR = 'DR',
    PROF = 'PROF',
    LORD = 'LORD',
    LADY = 'LADY',
    REV = 'REV',
}

export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum CountryEnum {
    ENGLAND = 'ENGLAND',
    WALES = 'WALES',
    NORTHERN_IRELAND = 'NORTHERN_IRELAND',
}

export enum DebtRangeEnum {
    LESS_THAN_5000 = 'LESS_THAN_5000',
    BETWEEN_5000_AND_20000 = 'BETWEEN_5000_AND_20000',
    GREATER_THAN_20000 = 'GREATER_THAN_20000',
}

export class RegisterDto {
    @ApiProperty({ enum: TitleEnum })
    @IsEnum(TitleEnum)
    title: TitleEnum;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @ApiProperty({ enum: GenderEnum })
    @IsEnum(GenderEnum)
    gender: GenderEnum;

    @ApiProperty({ example: '+447911123456' })
    @IsString()
    @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number format' })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com' })
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
    @MinLength(8)
    @MaxLength(64)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message:
                'Password must contain uppercase, lowercase, number, and special character',
        },
    )
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}