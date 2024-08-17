import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LinksEntity} from "./entities/links.entity";
import {UsersEntity} from "../users/entities/users.entity";
import {CreateLinkDto} from "./dto/create.link.dto";
import {Unicom24Service} from "../unicom24/unicom24.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class LinksService {
    constructor(@InjectRepository(LinksEntity) private linksEntityRepository: Repository<LinksEntity>,
                @Inject(forwardRef(() => Unicom24Service))
                private readonly unicom24Service: Unicom24Service,
                private readonly usersService: UsersService) {
    }

    async generateLink() {
        const gen = Math.random().toString(32).substring(2, 12);
        const existingId = await this.linksEntityRepository.findOne({
            where: {
                custom_link: gen
            }
        });

        if (existingId) {
            return this.generateLink();
        } else {
            return gen;
        }
    }

    async createOrUpdateLink(user: UsersEntity, dto: CreateLinkDto) {
        const data: any = {}

        if (dto.lead_id) {
            data.lead = {
                id: dto.lead_id
            }
        }

        if (dto.user_id) {
            data.user = {
                id: dto.user_id
            }
        }

        if (dto.offer_id) {
            data.offer = {
                id: dto.offer_id
            }
        }

        if (dto.price) {
            data.price = dto.price
        }

        const query = new URLSearchParams()
        if (query.get('sub5')) {
            throw new BadRequestException('В вашей ссылке есть sub5 параметр. Он нужен для отслеживания, пожалуйста уберите его.')
        } else {
            query.set('sub5', user.id.toString())
        }

        const isExisting = await this.linksEntityRepository.findOne({
            select: {id: true},
            where: {
                offer: {id: dto.offer_id},
                user: {id: dto.user_id},
                lead: {id: dto.lead_id},
            }
        })

        if (isExisting) {
            const update = await this.linksEntityRepository.update({
                id: isExisting.id,
            }, {
                original_link: dto.original_link + '?' + query.toString(),
                custom_link: await this.generateLink(),
                ...data,
            })

            return await this.linksEntityRepository.findBy({id: isExisting.id})
        } else {
            return await this.linksEntityRepository.save({
                original_link: dto.original_link + '?' + query.toString(),
                custom_link: await this.generateLink(),
                ...data,
            })
        }
    }

    async transformLinks(links: LinksEntity[]) {
        const _links = []

        for (let i = 0; i < links.length; i++) {
            const offerData = await this.unicom24Service.getOfferById(links[i].offer.unicom_id)
            _links.push({
                ...links[i],
                offer: {
                    id: links[i].offer.id,
                    title: offerData?.title || undefined,
                    logo: offerData?.logo || undefined,
                    unicom_id: links[i].offer.unicom_id,
                    created_at: links[i].offer.created_at,
                    updated_at: links[i].offer.updated_at,
                }
            })

        }
        return _links
    }

    async getLinks(user: UsersEntity) {
        const links = await this.linksEntityRepository.find({
            where: {
                user: {
                    id: user.id
                }
            },
            relations: {
                offer: true
            },
            order: {
                created_at: "DESC"
            }
        })
        return this.transformLinks(links)
    }

    public async getLinkById(id: number) {
        const user = await this.usersService.findUserByIdTheDB(id)
        return await this.getLinks(user)
    }

    public async getLinkByIdLead(id: string) {
        const links = await this.linksEntityRepository.find({
            where: {
                lead: {
                    id: id
                }
            },
            relations: {
                offer: true
            },
            order: {
                created_at: "DESC"
            }
        })
        return this.transformLinks(links)
    }

    public async checkLink(hash: string) {
        const link = await this.linksEntityRepository.findOne({
            where: {
                custom_link: hash
            },
            select: {original_link: true, id: true}
        })

        if (link) {
            await this.linksEntityRepository.update({id: link.id}, {is_transition: true})
        }

        if (!link) {
            throw new NotFoundException()
        }

        return {
            link: link.original_link
        }
    }

    public async deleteById(user: UsersEntity, id: number) {
        if (user.rights !== "ADMIN") throw new UnauthorizedException({})
        await this.linksEntityRepository.delete({
            id: id
        })

        return true
    }
}