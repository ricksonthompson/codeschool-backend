import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../../errors/AppError';

import User from '../../models/User';

import IUserRepository from '../../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {

  constructor(
    private usersRepository : IUserRepository,
  ){}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    console.log({ name, email, password });
    
    const checkUserExists =  await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
