import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OnGoing } from './entity/ongoing.entity';
import { Report } from './entity/report.entity';
import { CreateOnGoingDto } from './dto/create-ongoing.dto';
import { UpdateOnGoingStatusDto } from './dto/update-ongoing-status.dto';
import { OnGoingDto } from './dto/ongoing.dto';
import { plainToInstance } from 'class-transformer';
import { OnGoingStatus } from './enum/ongoing-status.enum';

@Injectable()
export class OnGoingService {
    constructor(
        @InjectRepository(OnGoing)
        private readonly onGoingRepository: Repository<OnGoing>,
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
    ) { }

    async create(userId: string, createOnGoingDto: CreateOnGoingDto): Promise<OnGoingDto> {
        const report = await this.reportRepository.findOne({
            where: { id: createOnGoingDto.reportId }
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }
        // 檢查是否有在路上的紀錄還沒登記離開的
        const existingOnGoing = await this.onGoingRepository.findOne({
            where: {
                userId,
                status: In([OnGoingStatus.ON_THE_WAY, OnGoingStatus.ARRIVED])
            }
        });
        if (existingOnGoing) {
            throw new BadRequestException('請先回報離開的紀錄');
        }

        const onGoing = this.onGoingRepository.create({
            ...createOnGoingDto,
            userId,
            status: OnGoingStatus.ON_THE_WAY
        });

        const savedOnGoing = await this.onGoingRepository.save(onGoing);

        const onGoingWithUser = await this.onGoingRepository.findOne({
            where: { id: savedOnGoing.id },
            relations: ['user']
        });

        return plainToInstance(OnGoingDto, onGoingWithUser);
    }

    async updateStatus(id: number, userId: string, updateStatusDto: UpdateOnGoingStatusDto): Promise<OnGoingDto> {
        const onGoing = await this.onGoingRepository.findOne({
            where: { id, userId },
            relations: ['user']
        });

        if (!onGoing) {
            throw new NotFoundException('OnGoing record not found or not owned by user');
        }

        Object.assign(onGoing, updateStatusDto);
        const updatedOnGoing = await this.onGoingRepository.save(onGoing);

        return plainToInstance(OnGoingDto, updatedOnGoing);
    }

    async findByReport(reportId: number): Promise<OnGoingDto[]> {
        const onGoings = await this.onGoingRepository.find({
            where: { reportId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });

        return plainToInstance(OnGoingDto, onGoings);
    }

    async findByUser(userId: string): Promise<OnGoingDto[]> {
        const onGoings = await this.onGoingRepository.find({
            where: { userId },
            relations: ['user', 'report'],
            order: { createdAt: 'DESC' }
        });

        return plainToInstance(OnGoingDto, onGoings);
    }

    async remove(id: number, userId: string): Promise<void> {
        const onGoing = await this.onGoingRepository.findOne({
            where: { id, userId }
        });

        if (!onGoing) {
            throw new NotFoundException('OnGoing record not found or not owned by user');
        }

        await this.onGoingRepository.remove(onGoing);
    }
}