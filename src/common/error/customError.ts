export default class CustomError extends Error {
    statusCode: number;

    constructor(message: string | string[], statusCode: number) {
        if (Array.isArray(message)) super(message.join(', '));
        else if (typeof message === 'string') super(message);
        else super(JSON.stringify(message));

        this.statusCode = statusCode;
    }
}
