import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  welcome() {
    return {
      message: "MedKeep API (NestJS)",
      env: this.config.get<string>("NODE_ENV") ?? "development",
    };
  }

  @Get("health")
  health() {
    return { status: "ok", service: "api" };
  }
}
