class JoiCustomValidationError extends Error {
    constructor(msg, type) {
        super(msg);

        this.name = "JoiCustomValidationError";
        
        this.type = type;
    };
};

module.exports = JoiCustomValidationError;