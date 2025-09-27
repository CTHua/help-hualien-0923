import { ReportStatus } from "../enum/report-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { OnGoingDto } from "./ongoing.dto";
import { Type } from "class-transformer";

export class ReportDto {
    @ApiProperty({ description: '回報單ID' })
    id: number;

    @ApiProperty({ description: '使用者ID' })
    userId: string;

    @ApiProperty({ description: '姓名' })
    name: string;

    @ApiProperty({ description: '電話' })
    phone: string;

    @ApiProperty({ description: '地址' })
    address: string;

    @ApiProperty({ description: '描述' })
    description: string;

    @ApiProperty({ description: '緯度', required: false })
    latitude?: number;

    @ApiProperty({ description: '經度', required: false })
    longitude?: number;

    @ApiProperty({ description: '距離(公里)', required: false })
    distance?: number;

    @ApiProperty({ description: '在路上紀錄', type: [OnGoingDto] })
    @Type(() => OnGoingDto)
    onGoings: OnGoingDto[];

    @ApiProperty({ description: 'Status', enum: ReportStatus })
    status: ReportStatus;

    @ApiProperty({ description: 'Created At', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Updated At', type: Date })
    updatedAt: Date;
}