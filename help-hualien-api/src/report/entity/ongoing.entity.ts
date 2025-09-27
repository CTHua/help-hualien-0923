import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OnGoingStatus } from "../enum/ongoing-status.enum";
import { Report } from "./report.entity";
import { User } from "../../user/entity/user.entity";

@Entity("ongoing")
export class OnGoing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reportId: number;

    @Column()
    userId: string;

    @Column({ type: 'enum', enum: OnGoingStatus, default: OnGoingStatus.ON_THE_WAY })
    status: OnGoingStatus;

    @Column()
    minutes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Report, report => report.onGoings)
    @JoinColumn({ name: 'report_id' })
    report: Report;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}