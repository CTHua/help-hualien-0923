import { ApiProperty } from "@nestjs/swagger";
import { ReportStatus } from "../enum/report-status.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateReportDto {
    @ApiProperty({ description: 'Address' })
    @IsOptional()
    @IsString()
    address: string;

    @ApiProperty({ description: 'Status', enum: ReportStatus })
    @IsOptional()
    @IsEnum(ReportStatus)
    status: ReportStatus;

    @ApiProperty({ description: 'Description' })
    @IsOptional()
    @IsString()
    description: string;
}