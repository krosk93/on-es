import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
        window.removeEventListener("load", updateNetworkStatus);
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
};

export default useNetworkStatus;