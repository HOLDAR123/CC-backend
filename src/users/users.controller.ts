import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UpdateDataUsersDto} from './dto/update.user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {IsAdminGuard} from '../auth/guards/is-admin.guard';
import {UserDto} from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @ApiOperation({summary: 'Getting LIST users information'})
    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getUsers(): Promise<UserDto[]> {
        return this.usersService.findUsers();
    }

    @ApiOperation({summary: 'Getting information about a user by id'})
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getUserById(
        @Request() req: Request,
        @Param('id') id: number,
    ): Promise<UserDto> {
        return this.usersService.findUserById(id, req['user']);
    }

    @ApiOperation({summary: 'Updating user data'})
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    updateUser(
        @Request() req: Request,
        @Param('id') id: number,
        @Body() body: UpdateDataUsersDto
    ) {
        return this.usersService.updateDataUserById(id, body, req['user']);
    }

    @ApiOperation({summary: 'Delete user'})
    @Delete(':id')
    @UseGuards(JwtAuthGuard, IsAdminGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    deleteUser(@Request() req: Request, @Param('id') id: number) {
        return this.usersService.deleteUserById(id, req['user']);
    }
}
