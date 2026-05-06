export class BigintTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    // output value, you can use Number, parseFloat variations
    // also you can add nullable condition:
    // if (!Boolean(data)) return 0;

    return parseInt(data);
  }
}
