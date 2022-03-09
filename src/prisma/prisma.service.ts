import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        config();
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
    }


}
