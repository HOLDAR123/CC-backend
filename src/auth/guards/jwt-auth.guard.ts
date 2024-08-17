import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Reflector} from '@nestjs/core';
import {ALLOW_ANONYMOUS_META_KEY} from '../../consts/consts';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const isAnonymousAllowed =
            this.reflector.get<boolean>(
                ALLOW_ANONYMOUS_META_KEY,
                context.getHandler(),
            ) ||
            this.reflector.get<boolean>(ALLOW_ANONYMOUS_META_KEY, context.getClass());

        if (isAnonymousAllowed && !request.headers['authorization']) {
            return true;
        }

        return super.canActivate(context);
    }
}
