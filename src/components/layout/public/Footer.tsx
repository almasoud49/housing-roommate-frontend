import Link from "next/link";
import { Globe, Mail, Phone, MessageCircle } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold">HavenMate</h3>
          <p className="text-sm text-muted-foreground">
            Verified homes, compatible roommates, and easy rent & utility management — all in one place.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">For You</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/register" className="hover:text-primary">Create Account</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Tenant Dashboard</Link></li>
            <li><Link href="/landlord" className="hover:text-primary">Landlord Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Admin Panel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Newsletter</h4>
          <p className="mb-3 text-sm text-muted-foreground">Get the latest listings and tips.</p>
          <NewsletterForm />
          <div className="mt-4 flex gap-4 text-muted-foreground">
            <Globe className="size-5 hover:text-primary" />
            <Mail className="size-5 hover:text-primary" />
            <Phone className="size-5 hover:text-primary" />
            <MessageCircle className="size-5 hover:text-primary" />
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HavenMate. All rights reserved.
      </div>
    </footer>
  );
}
