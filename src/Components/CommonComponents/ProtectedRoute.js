import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function ProtectedRoute() {
  const account = useSelector((state) => state.account);
  const isAuthenticated = account?.account_id;

  // Don't even render Outlet if not authenticated
  if (!isAuthenticated) return null;

  return <Outlet />;
}

export default ProtectedRoute;
