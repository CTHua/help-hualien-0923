import { Expose, Transform } from "class-transformer";
import { OnGoingStatus } from "../enum/ongoing-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class OnGoingDto {
    @ApiProperty({ description: '在路上紀錄ID' })
    @Expose()
    id: number;

    @ApiProperty({ description: '回報單ID' })
    @Expose()
    reportId: number;

    @ApiProperty({ description: '使用者ID' })
    @Expose()
    userId: string;

    @ApiProperty({ description: '前往狀態', enum: OnGoingStatus })
    @Expose()
    status: OnGoingStatus;

    @ApiProperty({ description: '預計幾分鐘後到達' })
    @Expose()
    minutes: number;


    @ApiProperty({ description: 'Created At', type: Date })
    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Transform(({ obj }) => obj.user?.name)
    userName: string;

    @Expose()
    @Transform(({ obj }) => obj.user?.phone)
    userPhone: string;
}