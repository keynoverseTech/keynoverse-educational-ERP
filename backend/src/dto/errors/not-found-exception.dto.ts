import { ApiProperty } from '@nestjs/swagger';
export class NotFoundExceptionDto {
  static response: {
    description: 'Not found';
    type: NotFoundExceptionDto;
  };

  @ApiProperty({ example: 'NotFoundException' })
  type!: string;

  @ApiProperty({ example: 'Not found error description' })
  message!: string;
}
