import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import Category from "@/features/dashboard/components/Category";
import { FooterComp } from "@/components/layout/Footer";
import FeatureComingSoon from "@/components/common/FeatureComingSoon";
import { navigate } from "@/lib/router/navigate";

const TennisSeries = () => {
  const { seriesId } = useParams();

  const seriesName = useMemo(() => {
    const raw = String(seriesId ?? "").trim();
    if (!raw) return "Unknown Series";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [seriesId]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen bg-[#f6f6f6] md:pb-3">
      <PageHeader />
      <Category />

      <div className="page-padding-x py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm theme-text hover:text-brand-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        <FeatureComingSoon
          title="Tennis Series Page"
          description={`Series profile for ${seriesName} is scaffolded for MVP and ready for standings/schedule integration.`}
        />
      </div>

      <FooterComp />
    </div>
  );
};

export default TennisSeries;
