import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { UserAiAgentProfile } from './user-ai-agent-profile.entity';

export * from './tenant.entity';
export * from './user.entity';
export * from './user-ai-agent-profile.entity';

export const entities = [Tenant, User, UserAiAgentProfile];
