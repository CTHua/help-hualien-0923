import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from "./dto/create-report.dto";
import { CurrentUser } from "src/auth/current-user.decorator";
import { ReportDto } from "./dto/report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";

@ApiTags('Report')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('')
  @ApiOperation({ summary: 'Get reports' })
  async getReports(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number
  ) {
    return await this.reportService.getReports(latitude, longitude);
  }

  @Post('')
  @ApiOperation({ summary: 'Create report' })
  @ApiBody({ type: CreateReportDto })
  createReport(@CurrentUser() user: any, @Body() createReportDto: CreateReportDto) {
    const userId = user.uid;
    return this.reportService.createReport(userId, createReportDto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user reports' })
  @ApiResponse({ type: [ReportDto] })
  async findMy(
    @CurrentUser() user: any,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number
  ): Promise<ReportDto[]> {
    const userId = user.uid;
    return await this.reportService.findMy(userId, latitude, longitude);
  }

  @Put(':reportId')
  @ApiOperation({ summary: 'Update report' })
  @ApiParam({ name: 'reportId', description: 'Report ID' })
  @ApiBody({ type: UpdateReportDto })
  @ApiResponse({ type: ReportDto })
  async updateReport(@CurrentUser() user: any, @Param('reportId') reportId: string, @Body() updateReportDto: UpdateReportDto): Promise<ReportDto> {
    const userId = user.uid;
    return await this.reportService.updateReport(userId, +reportId, updateReportDto);
  }
}
