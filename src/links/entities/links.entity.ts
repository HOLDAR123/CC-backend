import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {UsersEntity} from "../../users/entities/users.entity";
import {OffersEntity} from "../../offers/entities/offers.entity";
import {LeadsEntity} from "../../leads/entities/leads.entity";

@Entity('links')
export class LinksEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @ManyToOne(() => OffersEntity, {nullable: true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'offer_id'})
    offer?: OffersEntity;

    @Index()
    @ManyToOne(() => UsersEntity, {nullable: true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user?: UsersEntity;

    @Index()
    @ManyToOne(() => LeadsEntity, {nullable: true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'lead_id'})
    lead?: LeadsEntity;

    @Column({default: false})
    is_transition: boolean

    @Column({default: 0})
    price?: number

    @Column({nullable: false})
    original_link: string;

    @Column({nullable: false})
    custom_link: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
