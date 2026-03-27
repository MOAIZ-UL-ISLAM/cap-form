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


export enum DebtAdviceForEnum {
    ME = 'ME',
    PARTNER_AND_ME = 'PARTNER_AND_ME',
}

export enum DebtAdviceReasonEnum {
    REPAY_AS_MUCH_AS_POSSIBLE = 'REPAY_AS_MUCH_AS_POSSIBLE',
    DEBT_FREE_QUICKLY = 'DEBT_FREE_QUICKLY',
    DEBT_FREE_LOW_COST = 'DEBT_FREE_LOW_COST',
    BUDGETING_ADVICE = 'BUDGETING_ADVICE',
    PROTECT_CREDIT_FILE = 'PROTECT_CREDIT_FILE',
    PROTECT_HOME_OR_ASSETS = 'PROTECT_HOME_OR_ASSETS',
    STOP_CREDITOR_ACTION = 'STOP_CREDITOR_ACTION',
    SHORT_TERM_HELP = 'SHORT_TERM_HELP',
    OTHER = 'OTHER',
}

export enum DebtCauseEnum {
    RELATIONSHIP_BREAKDOWN = 'RELATIONSHIP_BREAKDOWN',
    REDUNDANCY_UNEMPLOYMENT = 'REDUNDANCY_UNEMPLOYMENT',
    REDUCTION_IN_INCOME = 'REDUCTION_IN_INCOME',
    BEREAVEMENT = 'BEREAVEMENT',
    PHYSICAL_HEALTH = 'PHYSICAL_HEALTH',
    MENTAL_HEALTH = 'MENTAL_HEALTH',
    DISABILITY = 'DISABILITY',
    ADDICTION = 'ADDICTION',
    GAMBLING = 'GAMBLING',
    BORROWED_TOO_MUCH = 'BORROWED_TOO_MUCH',
    MISMANAGEMENT_OF_MONEY = 'MISMANAGEMENT_OF_MONEY',
    INCREASED_COST_OF_LIVING = 'INCREASED_COST_OF_LIVING',
    OTHER = 'OTHER',
}

export enum ResidentialStatusEnum {
    RENTING = 'RENTING',
    HOUSE_OWNER = 'HOUSE_OWNER',
    LIVING_WITH_PARENTS = 'LIVING_WITH_PARENTS',
    LODGER_HOUSE_SHARE = 'LODGER_HOUSE_SHARE',
}
