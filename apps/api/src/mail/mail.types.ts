// src/mail/mail.types.ts

export interface WelcomeCustomerSelfPayload {
    to: string;
    firstName: string;
    userId: string;
    password: string;
    [key: string]: unknown;
}

export interface WelcomeCustomerByPartnerPayload {
    to: string;
    firstName: string;
    userId: string;
    password: string;
    partnerName: string;
    [key: string]: unknown;
}

export interface PartnerNotificationPayload {
    to: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerUserId: string;
    [key: string]: unknown;
}

export interface ActivationEmailPayload {
    to: string;
    firstName: string;
    token: string;
    [key: string]: unknown;
}