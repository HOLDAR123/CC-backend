import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {UsersEntity} from "../../users/entities/users.entity";

@Entity('leads')
export class LeadsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @ManyToOne(() => UsersEntity, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'created_id'})
    created: UsersEntity;

    @Column({})
    username: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
