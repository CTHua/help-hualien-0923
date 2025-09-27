import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportDto {
    @ApiProperty({ description: '地址' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: '描述' })
    @IsString()
    @IsNotEmpty()
    description: string;
}