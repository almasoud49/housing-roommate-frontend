export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">About HavenMate</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>
          HavenMate is a full housing and roommate platform built for renters and property owners.
          We bring listings, roommate matching, rent payments, utility bill splitting, and
          maintenance tracking under one roof.
        </p>
        <p>
          Founded with the belief that renting should be transparent and stress-free, HavenMate
          verifies every landlord, documents every rental agreement, and keeps every tenant
          protected through secure SSLCommerz payments and a full dispute audit trail.
        </p>
        <p>
          Our platform serves three roles — tenants looking for homes or roommates, landlords
          managing properties, and property managers handling day-to-day operations — alongside
          platform admins who keep everything accountable.
        </p>
      </div>
    </div>
  );
}
