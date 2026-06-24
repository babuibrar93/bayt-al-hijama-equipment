import StructuredData from "@/components/seo/StructuredData";
import Loader from "@/components/layout/Loader";
import CursorGlow from "@/components/layout/CursorGlow";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyWhatsApp from "@/components/layout/StickyWhatsApp";
import ClientEffects from "@/components/layout/ClientEffects";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData />
      <Loader />
      <CursorGlow />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <StickyWhatsApp />
      <ClientEffects />
    </>
  );
}
