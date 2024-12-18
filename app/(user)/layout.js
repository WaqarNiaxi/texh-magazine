import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import DesktopMenu from "@/components/desktop-menu/DesktopMenu";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <DesktopMenu />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
