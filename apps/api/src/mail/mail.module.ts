// apps/api/src/mail/mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.getOrThrow<string>('mail.host'),
                    port: config.getOrThrow<number>('mail.port'),
                    secure: false,
                    requireTLS: true,
                    tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
                    auth: {
                        user: config.getOrThrow<string>('mail.user'),
                        pass: config.getOrThrow<string>('mail.pass'),
                    },
                },
                defaults: {
                    from: `"noreply" <${config.getOrThrow<string>('mail.from')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter(),
                    options: { strict: false },
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }