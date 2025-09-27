import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OnGoingService } from './ongoing.service';
import { CreateOnGoingDto } from './dto/create-ongoing.dto';
import { UpdateOnGoingStatusDto } from './dto/update-ongoing-status.dto';
import { OnGoingDto } from './dto/ongoing.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@ApiTags('OnGoing')
@ApiBearerAuth()
@Controller('ongoing')
export class OnGoingController {
    constructor(private readonly onGoingService: OnGoingService) {}

    @Post()
    @ApiOperation({ summary: 'Create ongoing record - User starts going to help' })
    @ApiBody({ type: CreateOnGoingDto })
    @ApiResponse({ type: OnGoingDto })
    async create(@CurrentUser() user: any, @Body() createOnGoingDto: CreateOnGoingDto): Promise<OnGoingDto> {
        const userId = user.uid;
        return await this.onGoingService.create(userId, createOnGoingDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update ongoing status (arrived, left, etc.)' })
    @ApiParam({ name: 'id', description: 'OnGoing ID' })
    @ApiBody({ type: UpdateOnGoingStatusDto })
    @ApiResponse({ type: OnGoingDto })
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() updateStatusDto: UpdateOnGoingStatusDto
    ): Promise<OnGoingDto> {
        const userId = user.uid;
        return await this.onGoingService.updateStatus(+id, userId, updateStatusDto);
    }

    @Get('report/:reportId')
    @ApiOperation({ summary: 'Get all ongoing records for a specific report' })
    @ApiParam({ name: 'reportId', description: 'Report ID' })
    @ApiResponse({ type: [OnGoingDto] })
    async findByReport(@Param('reportId') reportId: string): Promise<OnGoingDto[]> {
        return await this.onGoingService.findByReport(+reportId);
    }

    @Get('my')
    @ApiOperation({ summary: 'Get current user ongoing records' })
    @ApiResponse({ type: [OnGoingDto] })
    async findMy(@CurrentUser() user: any): Promise<OnGoingDto[]> {
        const userId = user.uid;
        return await this.onGoingService.findByUser(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel ongoing record' })
    @ApiParam({ name: 'id', description: 'OnGoing ID' })
    @ApiResponse({ status: 200, description: 'OnGoing record deleted' })
    async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
        const userId = user.uid;
        return await this.onGoingService.remove(+id, userId);
    }
}