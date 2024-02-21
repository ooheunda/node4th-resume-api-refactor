import {
  InvalidInputError,
  NotFoundError,
  NotAuthorizedError,
} from "../utils/common.error.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtFunc.js";
import bcrypt from "bcrypt";

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  userSignUp = async (email, password, passwordConfirm, name, age) => {
    const isExistEmail = await this.usersRepository.findUserByEmail(email);
    if (isExistEmail) throw new Error("이미 존재하는 이메일입니다.");

    if (password !== passwordConfirm)
      throw new InvalidInputError(
        "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );

    if (password.length < 6)
      throw new InvalidInputError("비밀번호는 6자 이상으로 만들어주세요.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.userSignUp(
      email,
      hashedPassword,
      name,
      age
    );

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt,
    };
  };

  getSignInTokens = async (email, password) => {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) throw new NotFoundError("해당하는 유저가 존재하지 않습니다.");

    if (!(await bcrypt.compare(password, user.password)))
      throw new NotAuthorizedError("비밀번호가 올바르지 않습니다.");

    const accessToken = createAccessToken(user.userId);
    const refreshToken = createRefreshToken(user.userId);

    return { accessToken, refreshToken };
  };

  deleteUser = async (userId, password) => {
    const user = await this.usersRepository.findUserById(userId);

    if (!(await bcrypt.compare(password, user.password)))
      throw new NotAuthorizedError("비밀번호가 올바르지 않습니다.");

    await this.usersRepository.deleteUser(userId);
  };

  findUserInfoById = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new NotFoundError("해당하는 유저가 존재하지 않습니다.");

    return {
      userId: user.userid,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
}
