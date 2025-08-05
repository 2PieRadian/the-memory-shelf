export default class RandomStringGenerator {
  private static characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  static generate(length: number): string {
    let randomString = "";

    for (let i = 0; i < length; i++) {
      randomString +=
        this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    return randomString;
  }
}
