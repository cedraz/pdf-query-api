export function OmitEnum<T extends string | number>(
  enumObj: { [key: string]: T },
  omitKeys: string[],
): { [key: string]: T } {
  return Object.keys(enumObj)
    .filter((key) => !omitKeys.includes(key))
    .reduce(
      (result, key) => {
        result[key] = enumObj[key];
        return result;
      },
      {} as { [key: string]: T },
    );
}
