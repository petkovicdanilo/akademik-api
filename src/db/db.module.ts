import { Module } from "@nestjs/common";
import { PostgresqlProviderModule } from "./providers/postgresql.module";

@Module({
  imports: [PostgresqlProviderModule],
  exports: [PostgresqlProviderModule],
})
export class DbModule {}
