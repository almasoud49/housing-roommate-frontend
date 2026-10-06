export const metadata = { title: "Services" };

const services = [
  { title: "Verified Property Listings", desc: "Browse apartments, houses and rooms verified by our team." },
  { title: "Roommate Matching", desc: "Set lifestyle preferences and get matched with compatible roommates." },
  { title: "Application Workflow", desc: "Apply to a property in minutes and track your application status." },
  { title: "Secure Rent Payments", desc: "Pay deposits and rent online via bKash with full receipts." },
  { title: "Utility Bill Splitting", desc: "Split shared electricity, water and internet bills fairly." },
  { title: "Maintenance Requests", desc: "Submit repair requests and track progress to resolution." },
  { title: "Viewing Schedules", desc: "Book property viewings and get reminders." },
  { title: "Digital Documents", desc: "Store rental agreements and documents securely in one place." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div key={s.title} className="rounded-xl border p-5">
            <h3 className="mb-2 font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
