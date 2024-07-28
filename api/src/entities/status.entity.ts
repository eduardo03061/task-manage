import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;
}
