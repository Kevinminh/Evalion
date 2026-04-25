import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
