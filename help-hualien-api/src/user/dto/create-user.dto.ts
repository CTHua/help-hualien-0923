import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: '姓名' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '電話' })
    @IsNotEmpty()
    @Matches(/^09\d{8}$/, { message: '請輸入正確的手機格式（例如 0912345678）' })
    phone: string;
}