import { UserRole } from "dtos";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";
import { urls } from "urls";

import { useUserState } from "state/users";

interface Props {
  role: UserRole;
}

export const RoleRoute: React.FC<PropsWithChildren<Props>> = ({
  children,
  role,
}) => {
  const router = useRouter();
  const [initialised, user] = useUserState((s) => [
    s.initialised,
    s.loggedInUser,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (role !== "user") {
        if (initialised && (!user || user?.role !== role)) {
          router.push(urls.home());
        }
      }
    }
  }, [user?.role]);

  if (role === "user") {
    return <>{children}</>;
  }

  if (initialised && (!user || user?.role !== role)) {
    return null;
  }

  return <>{children}</>;
};