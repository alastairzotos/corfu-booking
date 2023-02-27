import { Button } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import * as React from "react";
import { urls } from "urls";

import { Breadcrumbs } from "src/components/breadcrumbs";

const AdminPage: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        list={[{ href: urls.home(), title: "Home" }]}
        current="Admin"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Button component={Link} href={urls.admin.operators()}>
          Operators
        </Button>
        <Button component={Link} href={urls.admin.serviceSchemas()}>
          Service schemas
        </Button>
        <Button component={Link} href={urls.admin.serviceSchemaCategories()}>
          Service schema categories
        </Button>
      </Box>
    </>
  );
};

export default AdminPage;
