import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Status } from './status.entity';
import { Priority } from './priority.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })  // Permitir nulos aquí
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', precision: 1, name: 'dueDate' })
  dueDate: Date; 

  @ManyToOne(() => Priority)
  @JoinColumn({ name: 'priority_id' })
  priority: Priority;


  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', precision: 1, name: 'createdAt' })
  createdAt: Date;
}
