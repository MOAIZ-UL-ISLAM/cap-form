// src/mail/mail.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
    ActivationEmailPayload,
    PartnerNotificationPayload,
    WelcomeCustomerByPartnerPayload,
    WelcomeCustomerSelfPayload,
} from './mail.types';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly loginUrl: string;

    constructor(
        private readonly mailer: MailerService,
        private readonly config: ConfigService,
    ) {
        this.loginUrl = this.config.getOrThrow<string>('app.frontendUrl');
    }

    async sendActivationEmail(payload: ActivationEmailPayload): Promise<void> {
        const activationUrl = `${this.loginUrl}/activate?token=${payload.token}`;
        await this.send(
            payload.to,
            'Account Activation – TIGCAP Portal',
            'activation',
            { firstName: payload.firstName, activationUrl },
        );
    }

    async sendWelcomeCustomerSelf(payload: WelcomeCustomerSelfPayload): Promise<void> {
        await this.send(
            payload.to,
            'Welcome to TIGCAP – Your Account Details',
            'welcome-customer-self',
            { ...payload, loginUrl: this.loginUrl },
        );
    }

    async sendWelcomeCustomerByPartner(payload: WelcomeCustomerByPartnerPayload): Promise<void> {
        await this.send(
            payload.to,
            'Your TIGCAP Account – Created by Your Adviser',
            'welcome-customer-partner',
            { ...payload, loginUrl: this.loginUrl },
        );
    }

    async sendPartnerNotification(payload: PartnerNotificationPayload): Promise<void> {
        await this.send(
            payload.to,
            `Client Account Created – ${payload.customerFirstName} ${payload.customerLastName}`,
            'welcome-partner-notification',
            payload,
        );
    }

    private async send(
        to: string,
        subject: string,
        template: string,
        context: Record<string, unknown> | object,  // ← accept any object
    ): Promise<void> {
        try {
            await this.mailer.sendMail({ to, subject, template, context });
            this.logger.log(`[${template}] sent → ${to}`);
        } catch (err) {
            this.logger.error(`[${template}] failed → ${to}`, err);
        }
    }
}