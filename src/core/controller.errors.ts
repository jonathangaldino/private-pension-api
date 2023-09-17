import { ApiProperty } from '@nestjs/swagger';

export class APIErrorResponse {
  @ApiProperty()
  error: string;
}
