import { getScrapIdType } from '../types';
import { scrapData } from './scrap_data';

// prisma 즉, DB접속은 service OR repository에서 사용해야됨
export const getScrapId = async ({
    prisma,
    id,
    path,
}: getScrapIdType): Promise<string[]> => {
    return await prisma.user
        .findUnique({
            where: { id },
            include: {
                [scrapData(path).column]: true,
            },
        })
        .then((data) =>
            data![scrapData(path).column].map(
                (el: any) => el[scrapData(path).id],
            ),
        );
};
