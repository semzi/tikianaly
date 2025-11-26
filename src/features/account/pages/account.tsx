import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormButton from "@/components/ui/Form/FormButton";
import { clearAuthToken } from "@/lib/api/axios";

type UserData = {
  name?: string;
  email?: string;
  _id?: string;
  [key: string]: unknown;
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem("tikianaly_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        }
      } catch {
        setUserData(null);
      }
    };

    loadUserData();
    // Listen for storage changes (e.g., from other tabs)
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUserData(null);
    navigate("/login");
  };

  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-neutral-n5">Manage your profile and access controls.</p>
      </header>

      <div className="rounded-xl border border-snow-200 bg-white p-5 shadow-sm space-y-4">
        {userData ? (
          <>
            <div>
              <p className="text-sm text-neutral-n5 uppercase tracking-wide">Name</p>
              <p className="text-lg font-semibold">{userData.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-n5 uppercase tracking-wide">Email</p>
              <p className="text-lg font-semibold">{userData.email || "N/A"}</p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-lg font-semibold text-neutral-n5">Not yet logged in</p>
          </div>
        )}

        <div className="flex gap-3">
          <FormButton className="btn-outline flex-1" label="Settings" />
          {userData && (
            <FormButton 
              className="btn-primary flex-1" 
              label="Logout" 
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountPage;

