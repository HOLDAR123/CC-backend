import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {OffersEntity} from "./entities/offers.entity";
import {Unicom24Service} from "../unicom24/unicom24.service";
import {OffersDto} from "./dto/offers.dto";
import {UsersEntity} from "../users/entities/users.entity";
import {LinksService} from "../links/links.service";

@Injectable()
export class OffersService {
    constructor(@InjectRepository(OffersEntity) private offersEntityRepository: Repository<OffersEntity>,
                @Inject(forwardRef(() => Unicom24Service))
                private unicom24Service: Unicom24Service,

                @Inject(forwardRef(() => LinksService))
                private linksService: LinksService) {
    }

    public async createOrRemove(unicom_id: number) {
        const exist = await this.offersEntityRepository.existsBy({
            unicom_id: unicom_id
        })

        if(exist) {
            await this.offersEntityRepository.delete({
                unicom_id: unicom_id
            })

            return
        }

        await this.offersEntityRepository.save({
            unicom_id: unicom_id
        })

        return
    }

    public async transformOffers(_offers: OffersEntity[]) {
        const offers = []
        for (let i = 0; i < _offers.length; i++) {
            const offer = await this.unicom24Service.getOfferById(_offers[i].unicom_id)

            offers.push({
                id: _offers[i].id,
                title: offer?.title || undefined,
                logo: offer?.logo  || undefined,
                unicom_id: _offers[i].unicom_id,
                created_at: _offers[i].created_at,
                updated_at: _offers[i].updated_at,
            })
        }
        return offers
    }

    public async getOffersList(): Promise<OffersDto[]> {
        const _offers = await this.offersEntityRepository.find({
            order: {
                created_at: "DESC"
            }
        })

        return this.transformOffers(_offers)
    }

    public async getOffers(user: UsersEntity): Promise<OffersDto[]> {
        if(user.rights === "ADMIN") {
            const _offers = await this.offersEntityRepository.find({
                order: {
                    created_at: "DESC"
                }
            })

            return this.transformOffers(_offers)
        } else {
            const links = await this.linksService.getLinks(user)
            return this.transformOffers(links.map((link) => link.offer))
        }
    }

    public async getOffersById(id: number) {
        return await this.offersEntityRepository.findOne({
            where: {
                id: id
            }
        })
    }
}
