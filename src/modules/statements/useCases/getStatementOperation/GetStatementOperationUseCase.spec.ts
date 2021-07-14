import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User;

describe('Get Balance', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
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

  it('should be able to get statement operation', async () => {
    const user_id = user.id as string;

    const statement = await inMemoryStatementsRepository.create({
      user_id,
      amount: 10,
      description: 'Freelancer',
      type: OperationType.DEPOSIT
    })

    const statement_id = statement.id as string;

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    });

    expect(statementOperation).toHaveProperty('id');
    expect(statementOperation.user_id).toBe(user_id);
  });

  it('should not be able to get statement operation with an non-existing user', async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: 'wrong-user-id',
        statement_id: '1234'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to get a non-existing statement operation', async () => {
    const user_id = user.id as string;

    expect(
      getStatementOperationUseCase.execute({
        user_id,
        statement_id: 'wrong-statement'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
