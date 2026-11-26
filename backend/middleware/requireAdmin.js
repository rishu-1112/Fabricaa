import { createHash, timingSafeEqual } from "node:crypto";

const digest = (value) => createHash("sha256").update(value).digest();

export default function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token || token.length < 32) {
    return res.status(503).json({ message: "Catalog administration is unavailable" });
  }

  const authorization = req.get("Authorization") || "";
  if (!timingSafeEqual(digest(authorization), digest(`Bearer ${token}`))) {
    res.set("WWW-Authenticate", "Bearer");
    return res.status(401).json({ message: "Admin authorization required" });
  }

  next();
}
