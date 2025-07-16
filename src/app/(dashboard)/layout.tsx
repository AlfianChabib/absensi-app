import Navbar from "@/components/main/Navbar";
import BottomNav from "@/components/navbar-components/bottom-nav";
import SessionProvider from "@/components/provider/session-provider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <section className="min-h-dvh">
        <Navbar />
        {children}
        <BottomNav />
      </section>
    </SessionProvider>
  );
}
