import rateLimit from "express-rate-limit";
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    message: "Too many login attempts. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const setPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 10,

  message: {
    message: "Too many password setup attempts",
  },
});

export const importLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 10,

  message: {
    message: "Too many imports",
  },
});

export const createCompanyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 20,

  message: {
    message: "Too many company creations",
  },
});
