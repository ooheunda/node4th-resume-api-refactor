export default (err, req, res, next) => {
  console.log(err.name, ":", err.message);

  if (
    err.name === "ValidationError" ||
    err.name === "PrismaClientValidationError"
  ) {
    return res.status(403).json({ message: "올바른 값을 입력해주세요." });
  }

  if (err.name === "SyntaxError") {
    return res.status(400).json({ message: "올바른 데이터를 전달해주세요." });
  }

  return res
    .status(500)
    .json({ errorMessage: "서버 내부 에러가 발생했습니다." });
};
