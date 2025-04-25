import { useEffect, useState } from "react";

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline_messages">
     <i class="fa-solid fa-circle-exclamation me-1"></i>  You are currently offline.
    </div>
  );
};

export default OfflineNotice;
