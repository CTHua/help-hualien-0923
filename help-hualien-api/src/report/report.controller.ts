import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from "./dto/create-report.dto";
import { CurrentUser } from "src/auth/current-user.decorator";

@ApiTags('Report')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('')
  @ApiOperation({ summary: 'Get reports' })
  async getReports() {
    return await this.reportService.getReports();
  }

  @Post('')
  @ApiOperation({ summary: 'Create report' })
  @ApiBody({ type: CreateReportDto })
  createReport(@CurrentUser() user: any, @Body() createReportDto: CreateReportDto) {
    const userId = user.uid;
    return this.reportService.createReport(userId, createReportDto);
  }
}
