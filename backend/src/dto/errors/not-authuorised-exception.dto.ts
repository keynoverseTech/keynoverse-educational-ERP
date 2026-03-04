import { ApiProperty } from '@nestjs/swagger';
export class UnauthorizedExceptionDto {
  static response: {
    description: 'Unauthorized Exception';
    type: UnauthorizedExceptionDto;
  };

  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'Unauthorized' })
  error!: string;

  @ApiProperty({ example: 'Missing Bearer token' })
  message!: string;
}
