const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Administration",
    items: [
      { title: "Overview", url: prefix },
      { title: "Users", url: `${prefix}/users` },
      { title: "Verifications", url: `${prefix}/verifications` },
      { title: "Reviews", url: `${prefix}/reviews` },
      { title: "Audit Logs", url: `${prefix}/audit-logs` },
      { title: "Settings", url: `${prefix}/settings` },
      { title: "Notifications", url: `${prefix}/notifications` },
    ],
  },
];
