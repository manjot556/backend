import { Body, Controller, Headers, HttpException, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { of } from 'rxjs/internal/observable/of';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { UserDtoPipe } from '../user/user-dto.pipe';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    @ApiCreatedResponse()
    public async login(@Body('username') username: string, @Body('password') password: string) {
        if (!username || !password) {
            return await of(
                new HttpException('More PAYMENT_REQUIRED in login process.', HttpStatus.PAYMENT_REQUIRED)
            ).toPromise();
        }
        const user = (await this.authService.login(username, password)) as User;
        if (!!user) {
            const token = await this.authService.signJWT(username, user.id);
            return token;
        }
    }
    @Post('token')
    @ApiBearerAuth('Bearer')
    public async refreshToken(@Headers('authorization') authorization: string) {
        return await this.authService.refreshToken(authorization.split(' ').pop());
    }

    /**
     * 创建 User
     */
    @Post('user')
    @ApiCreatedResponse()
    public async create(@Body(new UserDtoPipe()) userDTO: UserDto) {
        const user = await this.authService.createUser(userDTO).toPromise();
        return user;
    }
}
