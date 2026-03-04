import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorExceptionDto {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Internal Server Error' })
  message: string;
}
