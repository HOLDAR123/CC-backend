import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from "../users/dto/create.user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: 'Authenticate User'})
    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req: Request) {
        return this.authService.login(req['user']);
    }

    @ApiOperation({summary: 'Register User'})
    @Post('/register')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.register(body);
    }
}
