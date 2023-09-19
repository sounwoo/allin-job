import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { Service } from 'typedi';

@Service()
class CustomPrismaClient extends PrismaClient {
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

export default new CustomPrismaClient();
