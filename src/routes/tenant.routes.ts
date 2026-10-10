const prefix = "/dashboard";

export const tenantRoutes = [
  {
    title: "My Home",
    items: [
      { title: "Overview", url: prefix },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Payments", url: `${prefix}/payments` },
      { title: "Utility Bills", url: `${prefix}/utilities` },
      { title: "Documents", url: `${prefix}/documents` },
      { title: "Viewings", url: `${prefix}/viewings` },
      { title: "Maintenance", url: `${prefix}/maintenance` },
      { title: "Roommate Match", url: `${prefix}/roommate` },
      { title: "Reviews", url: `${prefix}/reviews` },
      { title: "Verification", url: `${prefix}/verification` },
      { title: "Notifications", url: `${prefix}/notifications` },
      { title: "Profile", url: `${prefix}/profile` },
    ],
  },
];
