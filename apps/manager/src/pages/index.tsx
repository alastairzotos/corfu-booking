import { useRouter } from "next/router";
import { useEffect } from "react";
import { urls } from "urls";

import { useUserState } from "state/users";

export default function Home() {
  const router = useRouter();
  const { initialised, loggedInUser } = useUserState();

  useEffect(() => {
    if (initialised) {
      if (!loggedInUser) {
        router.push(urls.login());
      } else if (loggedInUser.role === "admin") {
        router.push(urls.admin.home());
      } else if (loggedInUser.role === "operator") {
        router.push(urls.operators.home());
      }
    }
  }, [initialised, loggedInUser]);

  return null;
}