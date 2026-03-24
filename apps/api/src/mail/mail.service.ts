// apps/api/src/mail/mail.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface WelcomeMailPayload {
    to: string;
    firstName: string;
    userId: string;
    password: string;
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailer: MailerService,
        private readonly config: ConfigService,
    ) { }

    async sendWelcomeMail(payload: WelcomeMailPayload): Promise<void> {
        try {
            await this.mailer.sendMail({
                to: payload.to,
                subject: `The Insolvency Group - Regsitration Success for ${payload.firstName}`,
                template: 'welcome',
                context: {
                    firstName: payload.firstName,
                    userId: payload.userId,
                    password: payload.password,
                    loginUrl: this.config.getOrThrow<string>('app.frontendUrl'),
                },
            });

            this.logger.log(`Welcome email sent to ${payload.to}`);
        } catch (error) {
            this.logger.error(
                `Failed to send welcome email to ${payload.to}`,
                error,
            );
        }
    }
}