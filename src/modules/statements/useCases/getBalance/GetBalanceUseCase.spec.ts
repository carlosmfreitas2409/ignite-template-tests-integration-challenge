import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get user balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    });

    const user_id = user.id as string;

    const balance = await getBalanceUseCase.execute({ user_id });

    expect(balance).toHaveProperty('statement');
    expect(balance).toHaveProperty('balance');
  });

  it('should not be able to get user balance with an non-existing user', async () => {
    const user_id = 'wrong-user-id';

    expect(
      getBalanceUseCase.execute({ user_id })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
})
