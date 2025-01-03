import { AppDataSource } from "../database/dataSource";
import { User } from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);