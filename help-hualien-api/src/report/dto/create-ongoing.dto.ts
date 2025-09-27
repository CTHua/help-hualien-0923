import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOnGoingDto {
    @ApiProperty({ description: '回報單ID' })
    @IsNotEmpty()
    @IsNumber()
    reportId: number;

    @ApiProperty({ description: '預計幾分鐘後到達' })
    @IsNotEmpty()
    @IsNumber()
    minutes: number;
}