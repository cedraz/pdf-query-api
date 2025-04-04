import { registerDecorator, ValidationOptions } from 'class-validator';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { validateCNPJ } from 'src/utils/cnpj-validation';

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return validateCNPJ(value);
        },
        defaultMessage() {
          return ErrorMessagesHelper.INVALID_CNPJ;
        },
      },
    });
  };
}
