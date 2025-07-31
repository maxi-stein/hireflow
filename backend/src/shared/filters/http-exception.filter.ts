import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let message = exception.message;
    let details = null;

    // Handle validation errors specifically
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      // Check if it's a validation error (array of validation messages)
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const responseMessage = exceptionResponse.message;

        if (Array.isArray(responseMessage)) {
          // This is a validation error with multiple messages
          message = 'Validation failed';
          details = responseMessage;
        } else if (typeof responseMessage === 'string') {
          // Single validation message
          message = responseMessage;
        }
      }
    }

    const errorResponse = {
      statusCode: status,
      message: message,
      error: this.getErrorType(status),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
