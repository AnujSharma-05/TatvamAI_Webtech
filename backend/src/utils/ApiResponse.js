class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400 // Assuming status codes below 400 are successfull
    }
}

export { ApiResponse }