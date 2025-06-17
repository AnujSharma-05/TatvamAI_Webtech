class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "" // optional stack trace
    ){
        super(message) 
        this.statusCode = statusCode
        this.data = null 
        this.message = message // message to be sent in response
        this.success = false
        this.errors = errors

        if (stack) { // if stack is provided, use it
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor) // capture the stack trace
        }

    }
}

export { ApiError }