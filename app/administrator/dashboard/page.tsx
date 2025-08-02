"use client"
import { UserGrowthChart } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards"; 
import { StatsCard } from "@/features/administrator/components/StatsCard";
import { UserRoleDistribution } from "@/features/administrator/components/UserRoleDistribution";
import { generateDummyUsers } from "@/features/administrator/dummy";
import { User } from "@/shared-api/hooks/users/useUsers";
// Sample data untuk demo (hapus ini ketika menggunakan data real)
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "MEMBER",
    avatarUrl: null,
    cvUrl: null,
    isVerified: true,
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    role: "RECRUITER",
    avatarUrl: null,
    cvUrl: null,
    isVerified: true,
    createdAt: "2024-04-02T14:30:00Z",
    updatedAt: "2024-04-02T14:30:00Z"
  },
  // Tambahkan lebih banyak sample data untuk visualisasi yang lebih baik
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 3}`,
    name: `User ${i + 3}`,
    email: `user${i + 3}@example.com`,
    phone: `+123456789${i + 2}`,
    role: Math.random() > 0.7 ? "RECRUITER" : "MEMBER" as "MEMBER" | "RECRUITER",
    avatarUrl: null,
    cvUrl: null,
    isVerified: Math.random() > 0.3,
    // Spread data dalam 90 hari terakhir dengan distribusi acak
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }))
]

export default function AdminDashboardPage() { 
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <StatsCard />
      <div className="px-4 lg:px-6">
        <UserGrowthChart users={sampleUsers} /> 
      </div>
    </div>
  );
}
