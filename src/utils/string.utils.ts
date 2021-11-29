export class StringUtils {
  static toPascalCase(str: string) {
    return str.toLowerCase().replace(/([-_ ][a-z])|(^[a-zA-Z])/g, (group) => {
      return group
        .toUpperCase()
        .replace("-", "")
        .replace("_", "")
        .replace(" ", "");
    });
  }

  static randomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
