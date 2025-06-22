import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="bg-yellow-50 flex min-h-screen w-screen flex-col">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
