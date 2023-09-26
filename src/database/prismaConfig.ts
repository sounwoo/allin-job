import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class CustomPrismaClient extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        this.$connect()
            .then(() => console.log('Prisma 연결 성공'))
            .catch((err) => console.log('Prisma 실패', err));
    }
}
