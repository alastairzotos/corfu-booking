import { useRouter } from "next/router";
import * as React from "react";
import { urls } from "urls";

import { Breadcrumbs } from "src/components/breadcrumbs";
import { ServiceSchemaCategoryEdit } from "src/components/service-schema-category-edit";

const ServiceSchemaCategoryEditPage: React.FC = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <>
      <Breadcrumbs
        list={[
          { href: urls.home(), title: "Home" },
          { href: urls.admin.home(), title: "Admin" },
          {
            href: urls.admin.serviceSchemaCategories(),
            title: "Service schema categories",
          },
        ]}
        current="Edit service schema category"
      />

      <ServiceSchemaCategoryEdit id={id} />
    </>
  );
};

export default ServiceSchemaCategoryEditPage;