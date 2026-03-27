// src/forms/customer-start/dto/create-customer-start.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import {
    CountryEnum,
    DebtAdviceForEnum,
    DebtAdviceReasonEnum,
    DebtCauseEnum,
    ResidentialStatusEnum,
} from '../../../common/constants/enums';

export class CreateCustomerStartDto {
    @ApiProperty({ enum: DebtAdviceForEnum })
    @IsEnum(DebtAdviceForEnum)
    debtAdviceFor: DebtAdviceForEnum;

    @ApiProperty()
    @IsBoolean()
    hadPreviousDebtSolution: boolean;

    @ApiProperty()
    @IsBoolean()
    hadBreathingSpace: boolean;

    @ApiProperty({ enum: DebtAdviceReasonEnum })
    @IsEnum(DebtAdviceReasonEnum)
    mainReason: DebtAdviceReasonEnum;

    @ApiProperty({ enum: DebtCauseEnum })
    @IsEnum(DebtCauseEnum)
    debtCause: DebtCauseEnum;

    @ApiProperty()
    @IsBoolean()
    hasPersonalBarriers: boolean;

    // Required ONLY when hasPersonalBarriers is true
    @ApiPropertyOptional()
    @ValidateIf((o: CreateCustomerStartDto) => o.hasPersonalBarriers === true)
    @IsString()
    @MaxLength(1000)
    personalBarriersDetail?: string;

    @ApiProperty({ enum: CountryEnum })
    @IsEnum(CountryEnum)
    country: CountryEnum;

    @ApiProperty({ enum: ResidentialStatusEnum })
    @IsEnum(ResidentialStatusEnum)
    residentialStatus: ResidentialStatusEnum;

    @ApiProperty()
    @IsBoolean()
    hadBailiffContact: boolean;
}