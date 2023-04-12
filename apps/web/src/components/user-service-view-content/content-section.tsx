import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { ServiceDto, ServiceSchemaContentSectionDto } from "dtos";
import React from "react";

import { MultilineText } from "src/components/multiline-text";

const BulletList = styled("ul")(({ theme }) => ({
  "& li": {
    marginBottom: theme.spacing(1),
  },
}));

interface Props {
  service: ServiceDto;
  contentSection: ServiceSchemaContentSectionDto;
}

export const UserServiceViewContentSection: React.FC<Props> = ({
  service,
  contentSection,
}) => {
  if (!service.content?.[contentSection.key]) {
    return null;
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{contentSection.title}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {contentSection.type === "text" ? (
          <MultilineText
            content={(service.content[contentSection.key] as string) || ""}
          />
        ) : (
          <BulletList>
            {((service.content[contentSection.key] as string[]) || []).map(
              (bullet, index) => (
                <li key={index}>{bullet}</li>
              )
            )}
          </BulletList>
        )}
      </AccordionDetails>
    </Accordion>
  );
};