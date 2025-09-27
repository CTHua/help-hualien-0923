import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dto/create-report.dto";
import { Report } from "./entity/report.entity";
import { plainToInstance } from "class-transformer";
import { ReportDto } from "./dto/report.dto";
import { UserService } from "src/user/user.service";
import { UpdateReportDto } from "./dto/update-report.dto";

@Injectable()
export class ReportService {
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>;

    @Inject(UserService)
    private readonly userService: UserService;

    constructor() { }

    async createReport(userId: string, createReportDto: CreateReportDto) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const report = this.reportRepository.create({ ...createReportDto, userId, name: user.name, phone: user.phone });
        return this.reportRepository.save(report);
    }

    async getReports() {
        const reports = await this.reportRepository.find({
            relations: ['onGoings', 'onGoings.user'],
            order: {
                createdAt: 'DESC',
            },
        });

        const reportsWithStats = reports.map(report => {
            const onGoingCount = report.onGoings?.filter(og => og.status === 'on_the_way').length || 0;
            const arrivedCount = report.onGoings?.filter(og => og.status === 'arrived').length || 0;
            const leftCount = report.onGoings?.filter(og => og.status === 'left').length || 0;

            return {
                ...report,
                onGoingCount,
                arrivedCount,
                leftCount,
            };
        });

        return plainToInstance(ReportDto, reportsWithStats);
    }

    async findMy(userId: string) {
        const reports = await this.reportRepository.find({
            where: { userId },
            relations: ['onGoings', 'onGoings.user'],
        });
        return plainToInstance(ReportDto, reports);
    }

    async updateReport(userId: string, reportId: number, updateReportDto: UpdateReportDto) {
        const report = await this.reportRepository.findOne({ where: { id: reportId, userId } });
        if (!report) {
            throw new NotFoundException('Report not found or not owned by user');
        }
        Object.assign(report, updateReportDto);
        const updatedReport = await this.reportRepository.save(report);
        return plainToInstance(ReportDto, updatedReport);
    }

}

