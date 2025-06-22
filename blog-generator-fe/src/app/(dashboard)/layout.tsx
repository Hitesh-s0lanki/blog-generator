import { ReactFlowProvider } from "@xyflow/react";
import Navbar from "./_components/navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <ReactFlowProvider>
      <div>
        <Navbar />
        {children}
      </div>
    </ReactFlowProvider>
  );
};

export default Layout;
