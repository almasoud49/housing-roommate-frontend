export const metadata = { title: "Pricing" };

const plans = [
  { name: "Tenant", price: "Free", features: ["Browse all listings", "Apply to unlimited properties", "Roommate matching", "Maintenance requests", "Rent via bKash with receipts"] },
  { name: "Landlord", price: "2% per successful rental", features: ["Unlimited property listings", "Application management", "Tenant screening", "Earnings dashboard", "Utility bill tracking"], highlight: true },
  { name: "Property Manager", price: "Custom", features: ["Multi-property oversight", "Maintenance coordination", "Tenant communication", "Reporting & audit logs", "Dedicated support"] },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Pricing</h1>
      <p className="mb-8 text-muted-foreground">Simple, transparent pricing for every role.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-xl border p-6 ${p.highlight ? "border-primary shadow-md" : ""}`}>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="my-4 text-2xl font-bold text-primary">{p.price}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
