import { Typography } from "@mui/material";
import { getDefaultValuesForServiceSchema, ServiceNoId } from "dtos";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { urls } from "urls";

import { ManageServiceForm } from "src/components/service-manage";
import { StatusSwitch } from "src/components/status-switch";
import { useLoadServiceSchemaById } from "src/state/service-schemas";
import { useCreateService } from "src/state/services";

interface Props {
  serviceSchemaId: string;
  operatorId: string;
}

export const ServiceCreate: React.FC<Props> = ({
  serviceSchemaId,
  operatorId,
}) => {
  const router = useRouter();

  const [loadServiceSchemaStatus, loadServiceSchema, serviceSchema] =
    useLoadServiceSchemaById((s) => [s.status, s.request, s.value]);

  const [createServiceStatus, createService] = useCreateService((s) => [
    s.status,
    s.request,
  ]);

  useEffect(() => {
    if (serviceSchemaId) {
      loadServiceSchema(serviceSchemaId);
    }
  }, [serviceSchemaId]);

  const handleCreateService = async (service: ServiceNoId) => {
    await createService(service);
    router.push(urls.admin.operator(operatorId));
  };

  return (
    <StatusSwitch
      status={loadServiceSchemaStatus}
      error={
        <Typography>There was an error loading the service schema</Typography>
      }
    >
      {serviceSchema && (
        <ManageServiceForm
          title="Create service"
          operatorId={operatorId}
          service={{
            type: "none",
            name: "",
            description: "",
            photos: [],
            price: {},
            maxPeople: null,
            minPeople: null,
            data: getDefaultValuesForServiceSchema(serviceSchema!),
            operator: operatorId as any, // This will be cast as an ObjectId in the backend
            serviceSchema,
            numberOfBookings: 0,
          }}
          onSave={handleCreateService}
          saveStatus={createServiceStatus}
        />
      )}
    </StatusSwitch>
  );
};
