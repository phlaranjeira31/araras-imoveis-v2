
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ClientOverlays from "@/components/ClientOverlays";
import { WhatsAppProvider } from "@/components/WhatsAppContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ ADIÇÃO: envolve o layout inteiro
    <WhatsAppProvider>
      <div className="relative min-h-screen flex flex-col">
        {/* FUNDO GLOBAL (degradê suave) */}
        <div
          className="
          absolute inset-0 -z-10
          bg-gradient-to-b
          from-[#eefaf4]
          via-[#dcf3e6]
          to-[#bfe8d2]
        "
        />

        {/* camada de suavização */}
        <div className="absolute inset-0 -z-10 bg-white/55" />

        <Navbar />

        {/* 🔥 AQUI ENTRA O COOKIE */}
        <ClientOverlays />

        <main className="flex-1">{children}</main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </WhatsAppProvider>
  );
}




