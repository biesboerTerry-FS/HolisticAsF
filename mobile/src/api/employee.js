const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://holisticasf-server.vercel.app";

export const DEMO_EMPLOYEE = {
  employeeId: "demo-employee-1",
  name: "Jordan Rivera",
  email: "jordan@holisticaf.com",
  phone: "(555) 010-2044",
  address: "100 Holistic Way, Portland, OR 97203",
  position: "Store Associate",
};

const pad = (n) => String(n).padStart(2, "0");
const dateFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const demoShifts = () => [
  { _id: "demo-shift-1", date: dateFromNow(1), startTime: "09:00", endTime: "17:00", role: "Floor support", location: "HolisticAF Store", status: "scheduled" },
  { _id: "demo-shift-2", date: dateFromNow(3), startTime: "10:00", endTime: "18:00", role: "Inventory restock", location: "HolisticAF Store", status: "scheduled" },
  { _id: "demo-shift-3", date: dateFromNow(6), startTime: "08:00", endTime: "15:00", role: "Morning prep", location: "HolisticAF Store", status: "scheduled" },
];

// Session cache so the portal works even if the backend is unreachable.
let cachedEmployee = null;

export const getCachedEmployee = () => cachedEmployee;
export const setCachedEmployee = (employee) => {
  cachedEmployee = employee || null;
};

export async function fetchEmployeeProfile() {
  try {
    const response = await fetch(
      `${API_URL}/api/employees/me?employeeId=${DEMO_EMPLOYEE.employeeId}&source=mobile`,
      { headers: { Accept: "application/json" } },
    );
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success && data.employee) {
      cachedEmployee = { ...DEMO_EMPLOYEE, ...data.employee };
      return cachedEmployee;
    }
  } catch {
    // Silent fallback to the bundled demo profile.
  }
  return cachedEmployee || DEMO_EMPLOYEE;
}

export async function updateEmployeeProfile(profile) {
  const next = { ...cachedEmployee, ...profile };
  try {
    const response = await fetch(
      `${API_URL}/api/employees/me?source=mobile`,
      {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: next.employeeId,
          name: next.name,
          email: next.email,
          phone: next.phone,
          address: next.address,
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success && data.employee) {
      cachedEmployee = { ...DEMO_EMPLOYEE, ...data.employee };
      return { employee: cachedEmployee, local: false };
    }
  } catch {
    // Silent local fallback.
  }
  cachedEmployee = next;
  return { employee: cachedEmployee, local: true };
}

export async function fetchEmployeeShifts() {
  try {
    const response = await fetch(
      `${API_URL}/api/employees/me/shifts?employeeId=${DEMO_EMPLOYEE.employeeId}&source=mobile`,
      { headers: { Accept: "application/json" } },
    );
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success && Array.isArray(data.shifts) && data.shifts.length) {
      return data.shifts;
    }
  } catch {
    // Silent fallback.
  }
  return demoShifts();
}
