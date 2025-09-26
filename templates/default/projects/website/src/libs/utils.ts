export const isUserNewlyCreated = (createdAt: string, windowMinutes: number = 5): boolean => {
  const userCreatedAt = new Date(createdAt);
  const now = new Date();
  const timeDifferenceMs = now.getTime() - userCreatedAt.getTime();
  const windowMs = windowMinutes * 60 * 1000;
  return timeDifferenceMs >= 0 && timeDifferenceMs < windowMs;
};

export const getDay = (today: Date | number): { short: string; long: string } => {
  const short = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(today);
  const long = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(today);
  return { short, long };
};

export const getMonth = (today: Date | number): { short: string; long: string } => {
  const short = new Intl.DateTimeFormat("en-US", { month: "short" }).format(today);
  const long = new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  return { short, long };
};

export const domainURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://twobrokefriends-admin.vercel.app";

export const categories = [
  "home",
  "integrations",
  "deployments",
  "activity",
  "domains",
  "usage",
  "observability",
  "storage",
  "flags",
  "agent",
  "support",
  "settings",
];
