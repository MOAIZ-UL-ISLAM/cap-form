// src/auth/dto/set-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SetPasswordDto {
    @ApiProperty()
    @IsString() @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsString()
    @MinLength(8) @MaxLength(64)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password too weak',
    })
    password: string;
}