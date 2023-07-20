import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException('User with provided email already exists!');
        }

        // Creating a 16 characters long salt
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Meshing the salt and the hash together
        const result = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, result);

        return user;
    }

    signin(email: string, password: string) {
    }
}