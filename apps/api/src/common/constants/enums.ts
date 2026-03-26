// src/common/constants/enums.ts
// All domain enums live here. DTOs, services, and frontend types all
// reference this file — never duplicate enum definitions.


// Re-export Role from generated client so nothing imports Prisma directly
export { Role } from '../../../generated/prisma/client/client';


export enum TitleEnum {
    MR = 'MR',
    MRS = 'MRS',
    MS = 'MS',
    DR = 'DR',
    PROF = 'PROF',
    LORD = 'LORD',
    LADY = 'LADY',
    REV = 'REV',
}

export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum CountryEnum {
    ENGLAND = 'ENGLAND',
    WALES = 'WALES',
    NORTHERN_IRELAND = 'NORTHERN_IRELAND',
}

export enum DebtRangeEnum {
    LESS_THAN_5000 = 'LESS_THAN_5000',
    BETWEEN_5000_AND_20000 = 'BETWEEN_5000_AND_20000',
    GREATER_THAN_20000 = 'GREATER_THAN_20000',
}

