import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'admin'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an existing e-mail', async () => {
    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'admin'
    });

    expect(createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'admin'
    })).rejects.toBeInstanceOf(CreateUserError);
  });
})
