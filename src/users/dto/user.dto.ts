import {RightsEnum} from '../interfaces/rights.enum';
import {Exclude} from 'class-transformer';
import {ApiHideProperty} from '@nestjs/swagger';

export class UserDto {
  id: number;
  email: string;
  rights: RightsEnum;
  balance: number

  @ApiHideProperty()
  @Exclude()
  password?: string;

  @ApiHideProperty()
  @Exclude()
  created_at: Date;

  @ApiHideProperty()
  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
