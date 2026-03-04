import { BadRequestExceptionDto } from '../../dto/errors/bad-request-exception.dto';
import { InternalServerErrorExceptionDto } from '../../dto/errors/internal-server-error-exception.dto';
import { UnauthorizedExceptionDto } from '../../dto/errors/not-authuorised-exception.dto';
import { NotFoundExceptionDto } from '../../dto/errors/not-found-exception.dto';
import { UnprocessableEntityErrorExceptionDto } from '../../dto/errors/unprocessable-entity-exception.dto';

export const badRequestResponse = {
  description: 'Bad Request',
  type: BadRequestExceptionDto,
};

export const internalError = {
  description: 'Internal Server Error',
  type: InternalServerErrorExceptionDto,
};

export const notFoundResponse = {
  description: 'Not found',
  type: NotFoundExceptionDto,
};

export const unprocessableEntityResponse = {
  description: 'Unprocessable Entity',
  type: UnprocessableEntityErrorExceptionDto,
};

export const unauthorizedResponse = {
  description: 'Unauthorized',
  type: UnauthorizedExceptionDto,
};
