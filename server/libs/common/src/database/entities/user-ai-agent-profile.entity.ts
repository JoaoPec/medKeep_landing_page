import { IEntity } from '../interfaces';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_ai_agent_profiles')
export class UserAiAgentProfile implements IEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('UQ_user_ai_agent_profiles_user_id', { unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.aiAgentProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'bot_instance_id', type: 'varchar', length: 120, nullable: true })
  botInstanceId?: string;

  @Column({ name: 'external_ref', type: 'varchar', length: 120, nullable: true })
  externalRef?: string;

  @Column({ name: 'settings', type: 'jsonb', default: () => "'{}'::jsonb" })
  settings: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
