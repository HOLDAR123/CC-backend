import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {OffersService} from "../offers/offers.service";
import {DateTime} from "luxon";
import {Unicom24FilterQueryInterface} from "./interface/unicom24-filter-query.interface";

@Injectable()
export class Unicom24Service {
    constructor(private readonly httpService: HttpService, private readonly offersService: OffersService) {
    }

    private ENDPOINT = "https://api-xpartners.affise.com";
    private KEY = process.env.X_PARTNERS_KEY;

    private getUrlQuery(url: string, {id, date_from, date_to, slice}: Unicom24FilterQueryInterface) {
        let dateFrom: DateTime = DateTime.now().startOf('day'),
            dateTo = dateFrom.endOf('day')

        const query = new URLSearchParams()

        if (date_from) {
            dateFrom = DateTime.fromISO(date_from).startOf('day')
        }

        if (date_to) {
            dateTo = DateTime.fromISO(date_to).startOf('day')
        }

        query.set('filter[date_from]', dateFrom.toISODate())
        query.set('filter[date_to]', dateTo.toISODate())


        if (id) query.set('filter[sub5]', id.toString())

        if (slice.length > 0) {
            for (let i = 0; i < slice.length; i++) {
                query.append('slice[]', slice[i])
            }
        } else {
            query.set('slice[]', 'offer')
        }

        return url + `?${query}`
    }

    public async getOffers(page: number = 1, limit = 20, search?: string) {
        try {
            const query = new URLSearchParams()
            query.set('page', page.toString())
            query.set('limit', limit.toString())
            if (search) query.set('q', search)


            const _offers = await this.offersService.getOffersList()
            const {data} = await this.httpService.axiosRef.get(`${this.ENDPOINT}/3.0/offers?${query.toString()}`, {
                headers: {
                    'API-Key': this.KEY
                }
            })

            const {pagination, offers} = data
            const {total_count} = pagination

            return {
                data: offers.map((offer: any) => {
                    const exist = !!_offers.find(_ => _.unicom_id === offer.id)
                    return {
                        is_connect: exist,
                        ...offer
                    }
                }),
                pagination: {
                    page: page,
                    limit: limit,
                    count: total_count
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    public async getOfferById(id: number) {
        try {
            const {data} = await this.httpService.axiosRef.get(`${this.ENDPOINT}/3.0/offer/${id}`, {
                headers: {
                    'API-Key': this.KEY
                }
            })
            return data.offer
        } catch (e) {
            return undefined
        }
    }

    public async getReportsConversation({
                                            id,
                                            date_from,
                                            date_to
                                        }: Unicom24FilterQueryInterface, page: number = 1, limit = 20) {
        try {
            let dateFrom: DateTime = DateTime.now().startOf('day'),
                dateTo = dateFrom.endOf('day')

            const query = new URLSearchParams()
            if (id) query.set('subid5', id.toString())

            if (date_from) {
                dateFrom = DateTime.fromISO(date_from).startOf('day')
            }

            if (date_to) {
                dateTo = DateTime.fromISO(date_to).startOf('day')
            }

            query.set('date_from', dateFrom.toFormat('yyyy-LL-dd'))
            query.set('date_to', dateTo.toFormat('yyyy-LL-dd'))

            const url = `${this.ENDPOINT}/3.0/stats/conversions?${query.toString()}`

            const {data} = await this.httpService.axiosRef.get(url, {
                headers: {
                    'API-Key': this.KEY
                }
            })

            const {pagination, conversions} = data
            const {total_count} = pagination

            return {
                data: conversions,
                pagination: {
                    page: page,
                    limit: limit,
                    count: total_count
                }
            }
        } catch (e) {
            console.error(e?.response?.data)
            return {
                data: [],
                pagination: {
                    page: page,
                    limit: limit,
                    count: 0
                }
            }
        }
    }

    public async getReportsCustom(options: Unicom24FilterQueryInterface, page: number = 1, limit = 20) {
        const url = this.getUrlQuery(`${this.ENDPOINT}/3.0/stats/custom`, options)

        try {
            const {data} = await this.httpService.axiosRef.get(url, {
                headers: {
                    'API-Key': this.KEY
                }
            })

            const {pagination, stats} = data
            const {total_count} = pagination

            return {
                data: stats,
                pagination: {
                    page: page,
                    limit: limit,
                    count: total_count
                }
            }
        } catch (e) {
            console.error(e?.response?.data)
            return {
                data: [],
                pagination: {
                    page: page,
                    limit: limit,
                    count: 0
                }
            }
        }
    }
}
