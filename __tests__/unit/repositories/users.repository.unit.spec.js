import { expect, jest } from "@jest/globals";
import { UsersRepository } from "../../../src/repositories/users.repository.js";

let mockPrisma = {
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let usersRepository = new UsersRepository(mockPrisma);

describe("Users Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("findUserByEmail Method", async () => {
    const mockReturn = "prisma findUnique";
    mockPrisma.users.findUnique.mockReturnValue(mockReturn);

    const emailParam = "findUserByEmail@email.com";

    const user = await usersRepository.findUserByEmail(emailParam);

    expect(user).toBe(mockReturn);
    expect(usersRepository.prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email: emailParam },
    });
  });

  test("findUserById Method", async () => {
    const mockReturn = "prisma findUnique";
    mockPrisma.users.findUnique.mockReturnValue(mockReturn);

    const userIdParam = "99";

    const user = await usersRepository.findUserById(userIdParam);

    expect(user).toBe(mockReturn);
    expect(usersRepository.prisma.users.findUnique).toHaveBeenCalledWith({
      where: { userId: +userIdParam },
    });
  });

  test("userSignUp Method", async () => {
    const mockReturn = "prisma create";
    mockPrisma.users.create.mockReturnValue(mockReturn);

    const signUpParams = {
      email: "signUpMock@email.com",
      password: "signUpPassword",
      name: "signUpName",
      age: 100,
    };

    const user = await usersRepository.userSignUp(
      signUpParams.email,
      signUpParams.password,
      signUpParams.name,
      signUpParams.age
    );

    expect(user).toBe(mockReturn);
    expect(usersRepository.prisma.users.create).toHaveBeenCalledWith({
      data: {
        ...signUpParams,
        kind: "USER",
      },
    });
  });

  test("deleteUser Method", async () => {
    const userIdParam = "10";

    await usersRepository.deleteUser(userIdParam);

    expect(usersRepository.prisma.users.delete).toHaveBeenCalledWith({
      where: { userId: +userIdParam },
    });
  });
});
