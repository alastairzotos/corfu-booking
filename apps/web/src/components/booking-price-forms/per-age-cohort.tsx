import { TextField } from "@mui/material";
import React from "react";

import { BookingPriceProps } from "src/components/booking-price-forms/props";

export const PerAgeCohortPriceDetails: React.FC<BookingPriceProps> = ({
  pricing,
  priceDetails,
  setPriceDetails,
}) => {
  return (
    <>
      {pricing.perAgeCohort?.ageCohorts.map((cohort) => (
        <TextField
          key={cohort.name}
          type="number"
          inputProps={{
            min: 0,
          }}
          label={`Number of ${cohort.name.toLocaleLowerCase()}`}
          value={priceDetails.perAgeCohort?.guestsInCohorts[cohort.name]}
          onChange={(e) =>
            setPriceDetails({
              ...priceDetails,
              perAgeCohort: {
                ...priceDetails.perAgeCohort,
                guestsInCohorts: {
                  ...priceDetails.perAgeCohort?.guestsInCohorts,
                  [cohort.name]: parseInt(e.target.value, 10),
                },
              },
            })
          }
        />
      ))}
    </>
  );
};
