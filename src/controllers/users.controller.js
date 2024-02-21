export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  userSignUp = async (req, res, next) => {
    try {
      const { email, password, passwordConfirm, name, age } = req.body;

      const user = await this.usersService.userSignUp(
        email,
        password,
        passwordConfirm,
        name,
        age
      );

      return res
        .status(201)
        .json({
          message: `${user.name}님, 가입이 완료되었습니다.`,
          data: user,
        });
    } catch (err) {
      next(err);
    }
  };

  userSignIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const tokens = await this.usersService.getSignInTokens(email, password);

      res.cookie("accessToken", `Bearer ${tokens.accessToken}`);
      res.cookie("refreshToken", `Bearer ${tokens.refreshToken}`);

      return res.status(200).json({ message: "환영합니다!" });
    } catch (err) {
      next(err);
    }
  };

  findUserInfoById = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const userInfo = await this.usersService.findUserInfoById(userId);

      return res.status(200).json({ data: userInfo });
    } catch (err) {
      next(err);
    }
  };

  findMyInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const userInfo = await this.usersService.findUserInfoById(userId);

      return res.status(200).json({ data: userInfo });
    } catch (err) {
      next(err);
    }
  };
}
