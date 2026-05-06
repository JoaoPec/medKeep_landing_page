import { IEntity } from '../interfaces';
import { UserKind } from '../enums';
import { Tenant } from './tenant.entity';
import { UserAiAgentProfile } from './user-ai-agent-profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index('UQ_users_tenant_email', ['tenantId', 'email'], { unique: true })
export class User implements IEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_users_tenant_id')
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'enum', enum: UserKind, default: UserKind.MEMBER })
  kind: UserKind;

  @Column({ type: 'varchar', length: 180 })
  fullName: string;

  @Column({ type: 'varchar', length: 180 })
  email: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata: Record<string, unknown>;

  @OneToOne(() => UserAiAgentProfile, (profile) => profile.user)
  aiAgentProfile?: UserAiAgentProfile;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
