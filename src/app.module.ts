import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { LogModule } from './modules/log/log.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './modules/log/log.interceptor';

@Module({
    imports: [
        UserModule,
        CommentModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'test',
            entities: ['dist/**/**.entity{.ts,.js}'], // sb webpack
            synchronize: true,
        }),
        AuthModule,
        LogModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: LogInterceptor,
        // },
    ],
    exports: [AuthModule],
})
export class AppModule { }
