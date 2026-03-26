// src/geo/geo.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { Request } from 'express';
import { GeoLocation } from './geo.types';


@Injectable()
export class GeoService {
    private readonly logger = new Logger(GeoService.name);
    private readonly IS_DEV = process.env.NODE_ENV !== 'production';

    extractIp(req: Request): string {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
            return raw.split(',')[0].trim();
        }
        return req.socket?.remoteAddress ?? '0.0.0.0';
    }

    async lookup(ip: string): Promise<GeoLocation> {
        const isLoopback =
            ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1';
        const target = isLoopback && this.IS_DEV ? '' : ip;

        try {
            const { data } = await axios.get<{
                ip: string;
                city: string;
                country_name: string;
                region: string;
                timezone: string;
                org: string;
                error?: boolean;
                reason?: string;
            }>(`https://ipapi.co/${target}json/`, {
                timeout: 5000,
                headers: { 'User-Agent': 'nodejs-app/1.0' },
            });

            if (data.error) throw new Error(data.reason ?? 'ipapi error');

            return {
                ip: data.ip ?? target,
                city: data.city ?? 'Unknown',
                country: data.country_name ?? 'Unknown',
                region: data.region ?? 'Unknown',
                timezone: data.timezone ?? 'Unknown',
                isp: data.org ?? 'Unknown',
            };
        } catch (err) {
            this.logger.warn(`Geo lookup failed for ${ip}: ${String(err)}`);
            return {
                ip, city: 'Unknown', country: 'Unknown',
                region: 'Unknown', timezone: 'Unknown', isp: 'Unknown'
            };
        }
    }
}