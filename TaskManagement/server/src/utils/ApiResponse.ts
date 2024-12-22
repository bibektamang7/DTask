export class ApiResponse<T>{
    success: boolean;
    statusCode: number;
    data: T;
    message: string;
    constructor(statusCode:number, data: T, message: string = "success") {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}
