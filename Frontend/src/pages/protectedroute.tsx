import React from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/loader";

const ProtectedRoute = ({
  isAuth,
  children,
}: {
  isAuth: boolean | null;
  children: React.ReactNode;
}) => {
  if (isAuth === null) return <LoadingScreen />;
  return isAuth ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;