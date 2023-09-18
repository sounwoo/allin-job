import { validate } from 'class-validator';
import CustomError from '../error/customError';

export const validateDTO = async <T extends object>(dto: T) => {
    const errors = await validate(dto);

    if (errors.length > 0) {
        const errorMessage = errors.map((error) => {
            const temp = error.constraints && Object.values(error.constraints);
            return `${error.property} : ${temp}`;
        });

        throw new CustomError(errorMessage, 400);
    }
};
