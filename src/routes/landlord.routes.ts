const prefix = "/landlord";

export const landlordRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: prefix },
      { title: "My Properties", url: `${prefix}/properties` },
      { title: "Add Property", url: `${prefix}/properties/new` },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Viewings", url: `${prefix}/viewings` },
      { title: "Maintenance", url: `${prefix}/maintenance` },
      { title: "Utility Bills", url: `${prefix}/utilities` },
      { title: "Documents", url: `${prefix}/documents` },
      { title: "Payments & Refunds", url: `${prefix}/payments` },
      { title: "Earnings", url: `${prefix}/earnings` },
      { title: "Reviews", url: `${prefix}/reviews` },
      { title: "Notifications", url: `${prefix}/notifications` },
      { title: "Profile", url: `${prefix}/profile` },
    ],
  },
];

/**
 * Property managers share the /landlord area, but the backend only lets
 * LANDLORD/ADMIN create or list their own properties and process refunds.
 */
export const propertyManagerRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: prefix },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Viewings", url: `${prefix}/viewings` },
      { title: "Maintenance", url: `${prefix}/maintenance` },
      { title: "Utility Bills", url: `${prefix}/utilities` },
      { title: "Documents", url: `${prefix}/documents` },
      { title: "Earnings", url: `${prefix}/earnings` },
      { title: "Reviews", url: `${prefix}/reviews` },
      { title: "Notifications", url: `${prefix}/notifications` },
      { title: "Profile", url: `${prefix}/profile` },
    ],
  },
];
