import express from "express";
import { prisma } from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/auth.middleware.js";

dotenv.config();

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, checkPassword, name, age, college, gender } =
      req.body;
    if (password !== checkPassword)
      return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
    if (password.length < 6)
      return res
        .status(403)
        .json({ message: "비밀번호는 6자 이상으로 만들어주세요." });

    const isExistEmail = await prisma.users.findUnique({
      where: { email },
    });
    if (isExistEmail)
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const upperGender = gender ? gender.toUpperCase() : gender;

    const user = await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        kind: "USER",
      },
    });

    const userInfo = await prisma.userInfos.create({
      data: {
        userId: user.userId,
        name,
        age,
        college,
        gender: upperGender,
      },
    });

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      data: {
        email: user.email,
        detail: userInfo,
      },
    });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ message: "해당하는 유저가 존재하지 않습니다." });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "12h" }
    );

    res.cookie("authorization", `Bearer ${accessToken}`);

    return res.status(200).json({ message: "로그인 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 유저(본인) 정보 조회 API
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const userInfo = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      userInfo: true,
    },
  });

  return res.status(200).json({ data: userInfo });
});

export default router;
