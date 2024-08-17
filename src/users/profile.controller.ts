import {ClassSerializerInterceptor, Controller, Get, Request, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserDto} from './dto/user.dto';


@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Getting current user information'})
    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getCurrentUser(@Request() req: Request): UserDto {
        return new UserDto(req['user']);
    }
}
