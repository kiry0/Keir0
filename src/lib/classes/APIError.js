class APIError extends Error {
    constructor(msg, statusCode) {
        super(msg);

        this.name = "APIError";
        
        this.statusCode = statusCode;
    };
};

module.exports = APIError;