import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';


@Entity('categories')
@Unique(['name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', precision: 1, name: 'createdAt' })
  createdAt: Date;
}
