import { Injectable } from '@nestjs/common';
import {
  BaseRepository,
  InjectRepository,
  Tenant,
  User,
  UserAiAgentProfile,
  UserKind,
} from '@medkeep/common/database';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(UserAiAgentProfile)
    private readonly profileRepository: BaseRepository<UserAiAgentProfile>,
  ) {}

  async healthDb() {
    const [users, tenants, aiProfiles] = await Promise.all([
      this.userRepository.count(),
      this.tenantRepository.count(),
      this.profileRepository.count(),
    ]);

    return {
      status: 'ok',
      service: 'users',
      entities: {
        users,
        tenants,
        aiProfiles,
      },
      polymorphism: {
        discriminatorColumn: 'kind',
        supportedKinds: Object.values(UserKind),
      },
    };
  }
}
