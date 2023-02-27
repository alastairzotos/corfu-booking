import * as React from "react";
import { urls } from "urls";

import { Breadcrumbs } from "src/components/breadcrumbs";
import { ServiceSchemaList } from "src/components/service-schema-list";

const ServiceSchemasPage: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        list={[
          { href: urls.home(), title: "Home" },
          { href: urls.admin.home(), title: "Admin" },
        ]}
        current="Service Schemas"
      />

      <ServiceSchemaList />
    </>
  );
};

export default ServiceSchemasPage;