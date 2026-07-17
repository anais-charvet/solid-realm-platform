import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum AssetType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum AssetStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.DRAFT })
  status: AssetStatus;

  @Column({ nullable: true })
  artist: string | null;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) =>
        value === null ? null : parseFloat(value),
    },
  })
  price: number | null;

  @Column('text', { array: true, nullable: true })
  genre: string[] | null;

  @Column('text', { array: true, nullable: true })
  style: string[] | null;

  @Column({ nullable: true })
  label: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('jsonb', { nullable: true })
  technicalSpecs: Record<string, unknown> | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;
}
