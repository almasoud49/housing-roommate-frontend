import ContactForm from "@/components/form/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">Questions, partnerships, or support — we&apos;re here.</p>
      <ContactForm />
    </div>
  );
}
