import { registerDecorator, ValidationOptions } from 'class-validator';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

export function IsForbidden(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isForbidden',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined;
        },
        defaultMessage() {
          return ErrorMessagesHelper.isForbidden(propertyName);
        },
      },
    });
  };
}
