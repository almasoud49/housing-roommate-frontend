const prefix = "/landlord";

export const landlordRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: prefix },
      { title: "My Properties", url: `${prefix}/properties` },
      { title: "Add Property", url: `${prefix}/properties/new` },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Earnings", url: `${prefix}/earnings` },
      { title: "Profile", url: `${prefix}/profile` },
    ],
  },
];
