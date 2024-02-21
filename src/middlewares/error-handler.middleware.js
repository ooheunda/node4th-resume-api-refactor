export default (err, req, res, next) => {
  switch (err.name) {
    case "NotFoundError":
      return res.status(404).json({ message: err.message });

    case "NotAuthorizedError":
      return res.status(401).json({ message: err.message });

    case "InvalidInputError":
      return res.status(400).json({ message: err.message });

    case "ValidationError":
    case "PrismaClientValidationError":
      return res.status(403).json({ message: "올바른 값을 입력해주세요." });

    case "SyntaxError":
      return res.status(400).json({ message: "올바른 데이터를 전달해주세요." });

    default:
      return res
        .status(500)
        .json({ errorMessage: "서버 내부 에러가 발생했습니다." });
  }
};
