import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { OnGoingStatus } from "../enum/ongoing-status.enum";

export class UpdateOnGoingStatusDto {
    @ApiProperty({ description: '前往狀態', enum: OnGoingStatus })
    @IsEnum(OnGoingStatus)
    status: OnGoingStatus;

    @ApiProperty({ description: '預計幾分鐘後到達' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    minutes: number;
}