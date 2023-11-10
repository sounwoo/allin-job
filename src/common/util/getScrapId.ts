import { getScrapIdType } from '../types';
import { scrapData } from './scrap_data';

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
