// src/users/validators/role-creation.validator.ts
// Custom class-validator that checks debtRange is present when role === CUSTOMER
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function RequireDebtRangeForCustomer(
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'requireDebtRangeForCustomer',
            target: (object as any).constructor,
            propertyName,
            options: {
                message: 'debtRange is required when creating a CUSTOMER account',
                ...validationOptions,
            },
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const obj = args.object as Record<string, unknown>;
                    // Only enforce if role is CUSTOMER
                    if (obj['role'] === 'CUSTOMER') {
                        return value !== undefined && value !== null && value !== '';
                    }
                    return true; // not a customer — field is irrelevant
                },
            },
        });
    };
}