import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  versions: string[];

  @Column()
  serviceId: string;
}
