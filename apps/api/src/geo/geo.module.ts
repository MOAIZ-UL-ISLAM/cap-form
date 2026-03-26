// src/geo/geo.module.ts
import { Global, Module } from '@nestjs/common';
import { GeoService } from './geo.service';

@Global()
@Module({ providers: [GeoService], exports: [GeoService] })
export class GeoModule { }