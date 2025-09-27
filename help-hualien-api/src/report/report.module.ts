import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { OnGoingService } from './ongoing.service';
import { OnGoingController } from './ongoing.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "./entity/report.entity";
import { OnGoing } from "./entity/ongoing.entity";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Report, OnGoing]), UserModule],
  controllers: [ReportController, OnGoingController],
  providers: [ReportService, OnGoingService],
})
export class ReportModule {}
