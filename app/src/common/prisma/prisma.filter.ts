import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

const STATUS_MAP = {
  P2000: HttpStatus.PAYLOAD_TOO_LARGE,
  P2001: HttpStatus.NOT_FOUND,
  P2002: HttpStatus.CONFLICT,
  P2003: HttpStatus.CONFLICT,
  P2004: HttpStatus.CONFLICT,
  P2011: HttpStatus.CONFLICT,
  P2012: HttpStatus.BAD_REQUEST,
  P2013: HttpStatus.BAD_REQUEST,
  P2014: HttpStatus.CONFLICT,
  P2015: HttpStatus.NOT_FOUND,
  P2024: HttpStatus.GATEWAY_TIMEOUT,
  P2025: HttpStatus.NOT_FOUND,
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message.replace(/\n/g, '');

    if (!(exception.code in STATUS_MAP)) {
      super.catch(exception, host);
      return;
    }

    const status = STATUS_MAP[exception.code];

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
