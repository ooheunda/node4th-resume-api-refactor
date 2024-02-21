export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findUserByEmail = async (userEmail) => {
    const user = await this.prisma.users.findUnique({
      where: { email: userEmail },
    });

    return user;
  };

  findUserById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: { userId: +userId },
    });

    return user;
  };

  userSignUp = async (email, password, name, age) => {
    const user = await this.prisma.users.create({
      data: {
        email: email,
        password: password,
        name: name,
        age: age,
        kind: "USER",
      },
    });

    return user;
  };

  deleteUser = async (userId) => {
    await this.prisma.users.delete({
      where: { userId: +userId },
    });
  };
}
