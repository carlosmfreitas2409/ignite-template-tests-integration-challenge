import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    };

    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(session).toHaveProperty('user');
    expect(session).toHaveProperty('token');
  });

  it('should not be able to authenticate an non-existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'john.doe@example.com',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
