// src/forms/customer-start/dto/update-customer-start.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateCustomerStartDto {
    @ApiPropertyOptional({ enum: DebtAdviceForEnum })
    @IsOptional()
    @IsEnum(DebtAdviceForEnum)
    debtAdviceFor?: DebtAdviceForEnum;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    hadPreviousDebtSolution?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    hadBreathingSpace?: boolean;

    @ApiPropertyOptional({ enum: DebtAdviceReasonEnum })
    @IsOptional()
    @IsEnum(DebtAdviceReasonEnum)
    mainReason?: DebtAdviceReasonEnum;

    @ApiPropertyOptional({ enum: DebtCauseEnum })
    @IsOptional()
    @IsEnum(DebtCauseEnum)
    debtCause?: DebtCauseEnum;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    hasPersonalBarriers?: boolean;

    @ApiPropertyOptional()
    @ValidateIf((o: UpdateCustomerStartDto) => o.hasPersonalBarriers === true)
    @IsString()
    @MaxLength(1000)
    personalBarriersDetail?: string;

    @ApiPropertyOptional({ enum: CountryEnum })
    @IsOptional()
    @IsEnum(CountryEnum)
    country?: CountryEnum;

    @ApiPropertyOptional({ enum: ResidentialStatusEnum })
    @IsOptional()
    @IsEnum(ResidentialStatusEnum)
    residentialStatus?: ResidentialStatusEnum;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    hadBailiffContact?: boolean;
}