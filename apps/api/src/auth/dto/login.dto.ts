// apps/api/src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'TIGCAP6003352' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^TIGCAP\d{7}$/, { message: 'Invalid User ID format' })
    userId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}