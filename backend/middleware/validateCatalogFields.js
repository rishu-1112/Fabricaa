export default function validateCatalogFields(allowedFields) {
  return (req, res, next) => {
    const { body } = req;
    if (
      !body ||
      Array.isArray(body) ||
      typeof body !== "object" ||
      Object.keys(body).length === 0 ||
      Object.keys(body).some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({ message: "Submit supported catalog fields only" });
    }
    next();
  };
}
