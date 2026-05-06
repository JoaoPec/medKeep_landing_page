import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  Tenant,
  User,
  UserAiAgentProfile,
} from '@medkeep/common/database';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule.forFeature([Tenant, User, UserAiAgentProfile])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
