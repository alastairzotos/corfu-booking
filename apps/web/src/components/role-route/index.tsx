import { UserRole } from "dtos";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";
import { urls } from "urls";

import { useUserState } from "src/state/users";

interface Props {
  role: UserRole;
}

export const RoleRoute: React.FC<PropsWithChildren<Props>> = ({
  children,
  role,
}) => {
  const router = useRouter();
  const user = useUserState((s) => s.loggedInUser);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!user || user?.role !== role) {
        router.push(urls.home());
      }
    }
  }, [user?.role]);

  return <>{children}</>;
};
