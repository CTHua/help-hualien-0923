import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: '姓名' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '電話' })
    @IsNotEmpty()
    @IsString()
    phone: string;
}