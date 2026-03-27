// src/forms/customer-start/customer-start.module.ts
import { Module } from '@nestjs/common';
import { CustomerStartController } from './customer-start.controller';
import { CustomerStartService } from './customer-start.service';

@Module({
    controllers: [CustomerStartController],
    providers: [CustomerStartService],
    exports: [CustomerStartService],
})
export class CustomerStartModule { }