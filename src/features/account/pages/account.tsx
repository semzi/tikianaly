import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormButton from "@/components/ui/Form/FormButton";
import { clearAuthToken, getStoredUser } from "@/lib/api/axios";
import useProfileAvatar from "@/hooks/useProfileAvatar";

type UserData = {
  name?: string;
  email?: string;
  _id?: string;
  [key: string]: unknown;
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  const { avatarUrl } = useProfileAvatar({
    seed: userData?.email || userData?.name || "user",
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        const parsed = getStoredUser();
        setUserData(parsed);
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
        <h1 className="text-3xl font-bold theme-text">Account</h1>
        <p className="text-neutral-n5">Manage your profile and access controls.</p>
      </header>

      <div className="rounded-xl border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] p-5 shadow-sm space-y-4">
        {userData ? (
          <>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-brand-primary">
                    {(userData.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-neutral-n5 uppercase tracking-wide">Signed in as</p>
                <p className="text-lg font-medium theme-text truncate">{userData.name || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-n5 uppercase tracking-wide">Name</p>
              <p className="text-lg font-medium theme-text">{userData.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-n5 uppercase tracking-wide">Email</p>
              <p className="text-lg font-medium theme-text">{userData.email || "N/A"}</p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-lg font-medium text-neutral-n5">Not yet logged in</p>
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

