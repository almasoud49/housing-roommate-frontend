import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import BackToTop from "@/components/layout/public/BackToTop";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
