const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Administration",
    items: [
      { title: "Overview", url: prefix },
      { title: "Users", url: `${prefix}/users` },
      { title: "Audit Logs", url: `${prefix}/audit-logs` },
      { title: "Settings", url: `${prefix}/settings` },
    ],
  },
];
