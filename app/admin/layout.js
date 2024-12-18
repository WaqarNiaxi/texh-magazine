import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
      <main>{children}<ToastContainer/>  </main>
  );
};

export default Layout;
