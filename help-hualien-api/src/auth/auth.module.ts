import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import * as admin from 'firebase-admin';
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [
        // 初始化 Firebase Admin
        {
            provide: 'FIREBASE_ADMIN',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const firebaseConfig = {
                    type: configService.get<string>('TYPE'),
                    projectId: configService.get<string>('PROJECT_ID'),
                    privateKey: configService.get<string>('PRIVATE_KEY'),
                    clientEmail: configService.get<string>('CLIENT_EMAIL'),
                } as admin.ServiceAccount;

                if (admin.apps.length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(firebaseConfig),
                        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
                        storageBucket: `${firebaseConfig.projectId}.appspot.com`,
                    });
                }
                return admin;
            },
        },
        {
            provide: APP_GUARD,
            useClass: FirebaseAuthGuard,
        },
    ],
})
export class AuthModule { }