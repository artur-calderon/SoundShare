class ServerError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BadRequestError extends ServerError {
    constructor(message: string) {
        super(message, 400);
    }
}

class UnauthorizedError extends ServerError {
    constructor(message: string) {
        super(message, 401);
    }
}

class ForbiddenError extends ServerError {
    constructor(message: string) {
        super(message, 403);
    }
}

class NotFoundError extends ServerError {
    constructor(message: string) {
        super(message, 404);
    }
}

class NotImplementedError extends ServerError {
    constructor(message: string) {
        super(message, 501);
    }
}

export {
    ServerError,
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    NotImplementedError,
    UnauthorizedError,
};
