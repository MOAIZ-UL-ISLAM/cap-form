// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'TIGCAP1234567' })
    @IsString() @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsString() @IsNotEmpty()
    password: string;
}