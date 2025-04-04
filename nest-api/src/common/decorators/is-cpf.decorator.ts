// is-cpf.decorator.ts
import { registerDecorator, ValidationOptions } from 'class-validator';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { validateCPF } from 'src/utils/cpf-validation';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return validateCPF(value);
        },
        defaultMessage() {
          return ErrorMessagesHelper.INVALID_CPF;
        },
      },
    });
  };
}
