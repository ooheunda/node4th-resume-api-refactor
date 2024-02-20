import express from "express";
import cookieParser from "cookie-parser";
import ErrorHandler from "./src/middlewares/error-handler.middleware.js";
import Logger from "./src/middlewares/logger.middleware.js";
import UsersRouter from "./src/routes/users.router.js";
import ResumesRouter from "./src/routes/resumes.router.js";

const app = express();
const PORT = 3018;

app.use(Logger);
app.use(express.json());
app.use(cookieParser());

app.use("/api", [UsersRouter, ResumesRouter]);
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
