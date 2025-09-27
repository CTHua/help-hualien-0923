import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ description: '使用者ID' })
    id: string;

    @ApiProperty({ description: '姓名' })
    name: string;

    @ApiProperty({ description: '電話' })
    phone: string;

    @ApiProperty({ description: 'Created At', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Updated At', type: Date })
    updatedAt: Date;
}