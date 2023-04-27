import { NextPage } from "next";
import { useRouter } from "next/router";
import * as React from "react";
import { urls } from "urls";

import { Breadcrumbs } from "components/_core/breadcrumbs";
import { OperatorDashboardPage } from "components/operator/dashboard/operator/operator-dashboard-page";
import { OwnerOperatorDashboardProvider } from "components/operator/dashboard/operator/operator-dashboard-providers";
import { ServiceCreate } from "components/operator/dashboard/services/service-create";

const CreateServicePage: NextPage = () => {
  const router = useRouter();
  const schemaId = router.query.schemaId as string;

  return (
    <OwnerOperatorDashboardProvider>
      <OperatorDashboardPage>
        {(operator) => (
          <>
            <Breadcrumbs
              list={[
                { href: urls.home(), title: "Home" },
                { href: urls.operators.home(), title: "Operator" },
                { href: urls.operators.dashboard(), title: "Dashboard" },
              ]}
              current="Create service"
            />

            <ServiceCreate
              operatorId={operator._id}
              serviceSchemaId={schemaId}
            />
          </>
        )}
      </OperatorDashboardPage>
    </OwnerOperatorDashboardProvider>
  );
};

CreateServicePage.getInitialProps = () => ({});

export default CreateServicePage;
