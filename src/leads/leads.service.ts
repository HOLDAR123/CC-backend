import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LeadsEntity} from "./entities/leads.entity";
import {UsersEntity} from "../users/entities/users.entity";
import {CreateLeadsDto} from "./dto/create.leads.dto";
import {UpdateLeadsDto} from "./dto/update.leads.dto";

@Injectable()
export class LeadsService {
    constructor(@InjectRepository(LeadsEntity) private leadsEntityRepository: Repository<LeadsEntity>) {
    }

    async getLeads(user: UsersEntity) {
        return await this.leadsEntityRepository.find({
            where: {
                created: {id: user.id}
            }
        })
    }

    async getLeadById(user: UsersEntity, id: string) {
        return await this.leadsEntityRepository.findOne({
            where: {
                id: id,
                created: {id: user.id}
            }
        })
    }

    async createLeads(user: UsersEntity, dto: CreateLeadsDto) {
        return await this.leadsEntityRepository.save({
            created: {id: user.id},
            ...dto
        })
    }

    async updateLeads(user: UsersEntity, id: string, dto: UpdateLeadsDto) {
        return await this.leadsEntityRepository.update({
            id: id,
            created: {id: user.id},
        }, {
            username: dto.username
        })
    }

    async deleteLeads(user: UsersEntity, id: string) {
        return await this.leadsEntityRepository.delete({
            id: id,
            created: {id: user.id},
        })
    }
}
