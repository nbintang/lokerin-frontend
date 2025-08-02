import { User } from "@/shared-api/hooks/users/useUsers";
type UserRole = "MEMBER" | "RECRUITER";
export function generateDummyUsers(count = 100): User[] {
  const roles: UserRole[] = ["MEMBER", "RECRUITER"];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    users.push({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+1234567${String(i).padStart(3, "0")}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      avatarUrl:
        Math.random() > 0.3
          ? `/placeholder.svg?height=40&width=40&query=avatar${i}`
          : null,
      cvUrl: Math.random() > 0.4 ? `/cv-${i}.pdf` : null,
      isVerified: Math.random() > 0.2,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  return users;
}
