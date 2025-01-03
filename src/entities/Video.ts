import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Video  {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  title!: string;

  @Column({ type: "text" })
  description?: string;

  @Column({type: "float"})
  duration?: number;

  @Column({ type: "varchar", length: 100 })
  genre!: string;

  @Column({ type: "text", array: true })
  tags?: string[];

  @Column({ type: "int", default: 0 })
  views!: number;

  @Column({ type: "int", default: 0 })
  likes!: number;

  @Column({ type: "date"})
  createdAt!: Date;

  @Column({ type: "date"})
  updatedAt!: Date;



}