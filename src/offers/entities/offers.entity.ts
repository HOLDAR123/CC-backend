import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('offers')
export class OffersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    unicom_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
