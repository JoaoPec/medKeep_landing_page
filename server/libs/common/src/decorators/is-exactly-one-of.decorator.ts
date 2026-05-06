import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Custom validator to ensure exactly one of two properties exists
 * @param properties Array of property names to check
 * @param validationOptions Optional validation options
 */
export function IsExactlyOneOf(properties: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isExactlyOneOf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          const object = args.object as any;
          const presentProperties = properties.filter(
            (prop) => object[prop] !== undefined && object[prop] !== null,
          );
          return presentProperties.length === 1;
        },
        defaultMessage(args: any) {
          return `Exactly one of [${properties.join(', ')}] must be provided`;
        },
      },
    });
  };
}
