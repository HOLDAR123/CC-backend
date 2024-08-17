import {BadRequestException, Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {hash} from 'bcrypt';
import {UsersEntity} from './entities/users.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UpdateDataUsersDto} from './dto/update.user.dto';
import {RightsEnum} from './interfaces/rights.enum';
import {CreateUserDto} from './dto/create.user.dto';
import {UserDto} from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>
    ) {
    }

    private async encryptPassword(password: string) {
        return hash(password, 10);
    }

    private transformEntityToDto(entity: UsersEntity): UserDto {
        return new UserDto(entity);
    }

    async onModuleInit() {
        if (process.env.ROOT_USER && process.env.ROOT_PASSWORD) {
            const isExist = await this.existUserByEmail(process.env.ROOT_USER);
            if (!isExist) {
                await this.usersRepository.save({
                    email: process.env.ROOT_USER,
                    rights: RightsEnum.ADMIN,
                    password: await this.encryptPassword(process.env.ROOT_PASSWORD),
                });
            }
        }
    }

    public async findUserEntityByEmail(email: string): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: {email: email},
        });
    }

    public async findUserByEmail(email: string): Promise<UserDto> {
        const user = await this.usersRepository.findOne({
            where: {email: email},
        });
        return this.transformEntityToDto(user);
    }

    /**
     * Find a user by their id
     * @param {number} id - The id of the user to find
     * @param {UsersEntity} authUser - The authenticated user
     * @returns {UsersEntity} - The user with the matching id, or null if no user was found
     */
    public async findUserById(
        id: number,
        authUser: UsersEntity,
    ): Promise<UserDto> {
        if (authUser.rights !== RightsEnum.ADMIN && authUser.id !== id) {
            throw new UnauthorizedException({
                message: 'You do not have enough rights to perform this action',
            });
        }

        const isUserExist = await this.existUserById(id);

        if (!isUserExist) throw new NotFoundException();

        const user = await this.usersRepository.findOne({
            where: {id: id},
        });

        return this.transformEntityToDto(user);
    }


    public async findUserByIdTheDB(
        id: number
    ): Promise<UsersEntity> {
        return  await this.usersRepository.findOne({
            where: {id: id},
        });
    }

    public async findUsers(): Promise<UserDto[]> {
        const users = await this.usersRepository.find({
            order: {
                created_at: 'DESC',
            },
        });

        return users.map(this.transformEntityToDto);
    }

    /**
     * Check if a user exists by id
     * @param {number} id - The id of the user
     * @returns {boolean} - Whether the user exists or not
     */
    public async existUserById(id: number): Promise<boolean> {
        return await this.usersRepository.exists({
            where: {id: id},
        });
    }

    /**
     * Check if a user exists by email
     * @param {string} email - The email of the user
     * @returns {boolean} - Whether the user exists or not
     */
    public async existUserByEmail(email: string): Promise<boolean> {
        return await this.usersRepository.exists({
            where: {email: email},
        });
    }

    /**
     * Update the data of a user
     * @param {number} id - The id of the user
     * @param {UpdateDataUsersDto} dto - The data to update
     * @param {UsersEntity} authUser - The authenticated user
     */
    public async updateDataUserById(
        id: number,
        dto: UpdateDataUsersDto,
        authUser: UsersEntity
    ) {
        const isExistUser = await this.existUserById(id);

        if (authUser.rights !== RightsEnum.ADMIN && authUser.id !== id) {
            throw new UnauthorizedException({
                message: 'You do not have enough rights to perform this action',
            });
        }
        if (!isExistUser) {
            throw new NotFoundException();
        }

        const updateData: UpdateDataUsersDto = {};

        // Only admin can change the password or right
        if (authUser.rights === RightsEnum.ADMIN) {
            if (dto.rights) {
                updateData.rights = dto.rights;
            }

            if (dto.email !== undefined) {
                updateData.email = dto.email;
            }

            if(dto.balance !== undefined) {
                updateData.balance = dto.balance
            }
        }
        if (dto.password !== undefined) {
            updateData.password = await this.encryptPassword(dto.password);
        }

        await this.usersRepository.update(
            {
                id: id,
            },
            updateData,
        );

        return await this.findUserById(id, authUser);
    }

    /**
     * Creates a new user
     * @param {CreateUserDto} dto - The data of the user to create
     */
    public async createUser(dto: CreateUserDto) {
        const isExistUser = await this.existUserByEmail(dto.email);

        if (isExistUser) {
            throw new BadRequestException({
                message: 'This mail is already occupied by another user',
            });
        }

        await this.usersRepository.save({
            email: dto.email,
            rights: dto.rights,
            password: await this.encryptPassword(dto.password),
        });

        return await this.findUserByEmail(dto.email);
    }

    /**
     * Delete a user by its id
     * @param {number} id - The id of the user to delete
     * @param {UsersEntity} authUser - The authenticated user
     */
    public async deleteUserById(id: number, authUser: UsersEntity) {
        if (authUser.rights !== RightsEnum.ADMIN) {
            throw new UnauthorizedException({
                message: 'You do not have enough rights to perform this action',
            });
        }

        const isExistUser = await this.existUserById(id);

        if (!isExistUser) {
            throw new NotFoundException();
        }

        await this.usersRepository.delete({id: id});
    }
}
