import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// 🔑 Safe key generator
const keyGenerator = (req) => {
  if (req.user && req.user.id) {
    return `user-${req.user.id}`;
  }
  return ipKeyGenerator(req);
};

// 🔐 Auth limiter
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
});

// 🚀 API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, slow down",
  },
});

// 💳 Sensitive limiter
export const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests on this action",
  },
});