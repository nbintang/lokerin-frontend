import { User } from "@/shared-api/hooks/users/useUsers";

interface ChartData {
  date: string;
  member: number;
  recruiter: number;
  total: number;
}
  const processUserData = (users: User[]): ChartData[] => {
  if (!users || users.length === 0) return [];
  const dateGroups: { [key: string]: { member: number; recruiter: number } } =
    {};
  users.forEach((user) => {
    const date = new Date(user.createdAt).toISOString().split("T")[0];
    if (!dateGroups[date]) {
      dateGroups[date] = { member: 0, recruiter: 0 };
    }
    if (user.role === "MEMBER") {
      dateGroups[date].member++;
    } else if (user.role === "RECRUITER") {
      dateGroups[date].recruiter++;
    }
  });
  const sortedDates = Object.keys(dateGroups).sort();
  let cumulativeMember = 0;
  let cumulativeRecruiter = 0;

  return sortedDates.map((date) => {
    cumulativeMember += dateGroups[date].member;
    cumulativeRecruiter += dateGroups[date].recruiter;

    return {
      date,
      member: cumulativeMember,
      recruiter: cumulativeRecruiter,
      total: cumulativeMember + cumulativeRecruiter,
    };
  });
};
export default processUserData