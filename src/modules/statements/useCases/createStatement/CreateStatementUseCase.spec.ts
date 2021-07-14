import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let user: User;

describe('Create Statement', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    });
  });

  it('should be able to create a deposit statement', async () => {
    const user_id = user.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 10,
      description: 'Freelancer',
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty('id');
    expect(statement.type).toBe('deposit');
    expect(statement.user_id).toBe(user_id);
  });

  it('should be able to create a withdraw statement', async () => {
    const user_id = user.id as string;

    await createStatementUseCase.execute({
      user_id,
      amount: 20,
      description: 'Freelancer',
      type: OperationType.DEPOSIT
    });

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 10,
      description: 'Compras',
      type: OperationType.WITHDRAW
    });

    expect(statement).toHaveProperty('id');
    expect(statement.type).toBe('withdraw');
    expect(statement.user_id).toBe(user_id);
  });

  it('should not be able to create statement with an non-existing user', async () => {
    const user_id = 'wrong-user-id';

    expect(
      createStatementUseCase.execute({
        user_id,
        amount: 10,
        description: 'Compras',
        type: OperationType.WITHDRAW
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a withdraw statement with insufficient funds', async () => {
    const user_id = user.id as string;

    expect(
      createStatementUseCase.execute({
        user_id,
        amount: 10,
        description: 'Compras',
        type: OperationType.WITHDRAW
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
