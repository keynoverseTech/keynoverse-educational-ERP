import { ApiProperty } from '@nestjs/swagger';
export class UnprocessableEntityErrorExceptionDto {
  static response: {
    description: 'Unprocessable Entity Exception';
    type: UnprocessableEntityErrorExceptionDto;
  };

  @ApiProperty({ example: 422 })
  statusCode!: number;

  @ApiProperty({ example: 'Unprocessable Entity' })
  error!: string;

  @ApiProperty({
    example: ['email must be an email', 'firstName should not be empty'],
  })
  message!: string[];
}
