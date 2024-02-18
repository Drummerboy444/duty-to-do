import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/server";

export const extractPublicUserData = ({ id, username }: User) => ({
  id,
  username,
});

export const extractPrivateUserData = ({ id, username }: User) => ({
  id,
  username,
});

export const safeGetUser = async (userId: string) => {
  try {
    return await clerkClient.users.getUser(userId);
  } catch {
    return "UNKNOWN_USER";
  }
};

export const safeGetUserByUsername = async (username: string) => {
  const potentialUsers = await clerkClient.users.getUserList({
    username: [username],
  });

  const matchingUser = potentialUsers.find(
    (user) => user.username === username
  );

  return matchingUser === undefined ? "NO_USER_FOUND" : matchingUser;
};

const appendUser =
  <T>(extractUserData: (user: User) => T) =>
  async <T extends { userId: string }>(objectWithUserId: T) => {
    const user = await safeGetUser(objectWithUserId.userId);
    return user === "UNKNOWN_USER"
      ? { ...objectWithUserId, user: "UNKNOWN_USER" as const }
      : { ...objectWithUserId, user: extractUserData(user) };
  };

export const appendPublicUser = appendUser(extractPublicUserData);
export const appendPrivateUser = appendUser(extractPrivateUserData);

const appendUsers =
  <T>(extractUserData: (user: User) => T) =>
  async <T extends { userId: string }>(objectsWithUserIds: T[]) => {
    const userIds = objectsWithUserIds.map(({ userId }) => userId);

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    return objectsWithUserIds.map((objectsWithUserId) => {
      const user = users.find(({ id }) => id === objectsWithUserId.userId);
      return {
        ...objectsWithUserId,
        user:
          user === undefined
            ? ("UNKNOWN_USER" as const)
            : extractUserData(user),
      };
    });
  };

export const appendPublicUsers = appendUsers(extractPublicUserData);
export const appendPrivateUsers = appendUsers(extractPrivateUserData);
