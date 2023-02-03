import ArrowBackIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Button, Modal, Typography } from "@mui/material";
import { getServiceTypeLabel, OperatorDto, ServiceDto } from "dtos";
import Link from "next/link";
import React, { useState } from "react";
import { getSchemaForServiceType } from "service-schemas";
import { urls } from "urls";

import { BookingForm } from "src/components/booking-form";
import { ImageGallery } from "src/components/image-gallery";
import { KeyValue } from "src/components/key-value";
import { Titled } from "src/components/titled";

interface Props {
  bookingView?: boolean;
  service: ServiceDto;
  operator: OperatorDto;
}

export const UserServiceView: React.FC<Props> = ({
  bookingView = false,
  service,
  operator,
}) => {
  const schema = getSchemaForServiceType(service.type)!;
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <>
      {!bookingView && (
        <Button
          component={Link}
          href={urls.user.operator(operator)}
          sx={{ mb: 2 }}
        >
          <ArrowBackIcon />
          Back to services
        </Button>
      )}

      <Titled title={service.name}>
        {service.description.split("\n").map((line, index) => (
          <Typography key={index} sx={{ mt: 2, mb: 2 }}>
            {line}
          </Typography>
        ))}

        {!bookingView && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ mb: 2 }}
              size="large"
              onClick={() => setBookingModalOpen(true)}
            >
              Book now
            </Button>
          </Box>
        )}

        <KeyValue label="Type" value={getServiceTypeLabel(service.type)} />
        <KeyValue
          label="Adult Price"
          value={"€" + service.adultPrice.toFixed(2)}
        />
        <KeyValue
          label="Child Price"
          value={"€" + service.childPrice.toFixed(2)}
        />

        {Object.keys(service.data).map((fieldName) => {
          const field = schema.fields.find(
            (schemaField) => schemaField.field === fieldName
          )!;

          switch (field.type) {
            case "string":
              return (
                <KeyValue
                  key={fieldName}
                  label={field.label}
                  value={service.data[fieldName] as string}
                />
              );
            case "time":
              return (
                <KeyValue
                  key={fieldName}
                  label={field.label}
                  value={service.data[fieldName] as string}
                />
              );
            case "timeframe":
              return (
                <KeyValue
                  key={fieldName}
                  label={field.label}
                  value={service.data[fieldName] as string}
                />
              );
            case "photos": {
              if (
                !!service.data["photos"] &&
                (service.data["photos"] as string[]).length
              ) {
                return (
                  <ImageGallery items={service.data["photos"] as string[]} />
                );
              }

              return null;
            }
          }
        })}
      </Titled>

      <Modal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)}>
        <BookingForm
          operator={operator}
          service={service}
          onClose={() => setBookingModalOpen(false)}
        />
      </Modal>
    </>
  );
};
