import { Prisma } from "@prisma/client";

const isPrismaClientKnownRequestError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

export const isValueTooLongViolation = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  isPrismaClientKnownRequestError(error) && error.code === "P2000";

export const isUniqueConstraintViolation = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  isPrismaClientKnownRequestError(error) && error.code === "P2002";
