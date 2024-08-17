import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RightsEnum } from '../../users/interfaces/rights.enum';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.user.rights === RightsEnum.ADMIN;
  }
}
