import { verifyAccessToken, verifyRefreshToken } from "../utils/jwtFunc.js";
import { prisma } from "../utils/index.js";
import { NotFoundError } from "../utils/common.error.js";

export default async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) throw new Error("로그인이 필요합니다.");

    const [tokenType, token] = accessToken
      ? accessToken.split(" ")
      : refreshToken.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 일치하지 않습니다.");

    const decodedToken = accessToken
      ? verifyAccessToken(token)
      : verifyRefreshToken(token);
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new NotFoundError("서버에 사용자가 존재하지 않습니다.");
    }

    req.user = user;

    next();
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    switch (err.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res
          .status(401)
          .json({ message: err.message ?? "비정상적인 요청입니다." });
    }
  }
};
