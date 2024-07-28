import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('priorities')
export class Priority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;
}
