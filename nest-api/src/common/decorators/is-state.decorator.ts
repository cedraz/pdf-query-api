import { registerDecorator, ValidationOptions } from 'class-validator';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { brazilStates, validState } from 'src/utils/state-validation';

export function IsState(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isState',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return validState(value);
        },
        defaultMessage() {
          return `${ErrorMessagesHelper.INVALID_STATE} Estados válidos são: ${brazilStates.join(', ')}`;
        },
      },
    });
  };
}
