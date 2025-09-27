import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateReportDto {
    @ApiProperty({ description: '地址' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: '描述' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: '緯度', required: false })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiProperty({ description: '經度', required: false })
    @IsOptional()
    @IsNumber()
    longitude?: number;
}