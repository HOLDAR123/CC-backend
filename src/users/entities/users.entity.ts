import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {RightsEnum} from '../interfaces/rights.enum';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({unique: true, nullable: false})
    email: string;

    @Column({default: 0})
    balance: number;

    @Column({nullable: true})
    password?: string;

    @Column({
        type: 'enum',
        enum: RightsEnum,
        default: RightsEnum.USER,
        nullable: false,
    })
    rights: RightsEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
