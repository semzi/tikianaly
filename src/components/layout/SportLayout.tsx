import React from "react";
import { RightBar } from "@/components/layout/RightBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";

interface SportLayoutProps {
  leftBar: React.ReactNode;
  children: React.ReactNode;
  pageBottom?: React.ReactNode;
}

export const SportLayout: React.FC<SportLayoutProps> = ({ leftBar, children, pageBottom }) => {
  return (
    <div className="dark:bg-[#0D1117] min-h-screen bg-transparent md:pb-3 transition-colors">
      <PageHeader />
      <Category />

      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around" style={{ height: 'calc(100vh - 20px)' }}>
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          {leftBar}
        </section>

        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          {children}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
      </div>

      <FooterComp />
      {pageBottom}
    </div>
  );
};

export default SportLayout;
