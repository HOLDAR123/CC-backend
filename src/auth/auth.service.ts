import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {compare} from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {UsersEntity} from '../users/entities/users.entity';
import {CreateUserDto} from "../users/dto/create.user.dto";
import {UserDto} from "../users/dto/user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserEntityByEmail(email);
        if (!user) return null;

        const passwordValid = await compare(password, user.password);
        if (passwordValid) return user;

        return null;
    }

    async login({email, id}: UsersEntity | UserDto) {
        const payload = {username: email, sub: id};

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(user: CreateUserDto) {
        const _user = await this.usersService.createUser(user);
        return await this.login(_user)
    }
}
