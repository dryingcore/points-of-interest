export default class EnvConfig {
  public readonly SERVER_PORT: number;
  public readonly POSTGRES_HOST: string;
  public readonly POSTGRES_PORT: number;
  public readonly POSTGRES_DB: string;
  public readonly POSTGRES_USER: string;
  public readonly POSTGRES_PASSWORD: string;
  public readonly DATABASE_URL: string;

  constructor() {
    this.SERVER_PORT = Number(process.env.SERVER_PORT ?? 3000);
    this.POSTGRES_HOST = process.env.POSTGRES_HOST ?? "localhost";
    this.POSTGRES_PORT = Number(process.env.POSTGRES_PORT ?? 5432);
    this.POSTGRES_DB = process.env.POSTGRES_DB ?? "postgres";
    this.POSTGRES_USER = process.env.POSTGRES_USER ?? "postgres";
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "";

    this.DATABASE_URL = this.buildDatabaseUrl();

    this.validate();
  }

  private buildDatabaseUrl(): string {
    return `postgres://${this.POSTGRES_USER}:${encodeURIComponent(this.POSTGRES_PASSWORD)}@${this.POSTGRES_HOST}:${
      this.POSTGRES_PORT
    }/${this.POSTGRES_DB}`;
  }

  private validate() {
    const missing = [];

    if (!this.SERVER_PORT) missing.push("SERVER_PORT");
    if (!this.POSTGRES_HOST) missing.push("POSTGRES_HOST");
    if (!this.POSTGRES_PORT) missing.push("POSTGRES_PORT");
    if (!this.POSTGRES_DB) missing.push("POSTGRES_DB");
    if (!this.POSTGRES_USER) missing.push("POSTGRES_USER");
    if (!this.POSTGRES_PASSWORD) missing.push("POSTGRES_PASSWORD");

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  }
}
