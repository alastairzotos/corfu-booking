import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { Avatar, ListItemAvatar } from "@mui/material";
import { blue } from "@mui/material/colors";
import ListItem from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ServiceDto } from "dtos";
import Link from "next/link";
import React from "react";
import { urls } from "urls";

import { shortenText } from "src/util/misc";

interface Props {
  operatorId: string;
  service: ServiceDto;
}

export const ServiceListItem: React.FC<Props> = ({ operatorId, service }) => {
  return (
    <ListItem
      alignItems="flex-start"
      component={Link}
      href={urls.admin.service(operatorId, service._id)}
    >
      <ListItemAvatar>
        {service.photos && service.photos.length > 0 ? (
          <Avatar alt={service.name} src={service.photos[0]} />
        ) : (
          <Avatar sx={{ bgcolor: blue[500] }}>
            <BeachAccessIcon />
          </Avatar>
        )}
      </ListItemAvatar>

      <ListItemText
        primary={
          <>
            <strong>[{service.serviceSchema.label}]</strong> {service.name}
          </>
        }
        secondary={<>{shortenText(service.description, 150)}</>}
      />
    </ListItem>
  );
};
