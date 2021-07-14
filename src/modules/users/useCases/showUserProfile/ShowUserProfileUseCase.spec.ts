import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    });

    const user_id = user.id as string;

    const profile = await showUserProfileUseCase.execute(user_id);

    expect(profile).toHaveProperty('id');
    expect(profile.email).toBe('john.doe@example.com');
  });

  it('should not be able to show an non-existing user profile', async () => {
    const wrong_id = 'wrong-id';

    await expect(
      showUserProfileUseCase.execute(wrong_id)
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
