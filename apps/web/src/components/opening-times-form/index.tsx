import { Checkbox } from "@mui/material";
import {
  Day,
  defaultOpeningDayTime,
  OpeningHoursDto,
  OpeningTimesDto,
} from "dtos";
import React from "react";

import { DataGrid } from "@mui/x-data-grid";
import { TimeEditor } from "components/opening-times-form/time-editor";

interface Props {
  openingTimes: Record<Day, OpeningHoursDto>;
  setOpeningTimes: (openingTimes: OpeningTimesDto) => void;
}

export const OpeningTimesForm: React.FC<Props> = ({
  openingTimes,
  setOpeningTimes,
}) => {
  return (
    <DataGrid
      columns={[
        {
          width: 200,
          field: "day",
          headerName: "Day",
          editable: false,
          sortable: false,
          hideable: false,
        },
        {
          width: 200,
          field: "openingTime",
          headerName: "Opening Time",
          sortable: false,
          hideable: false,
          valueGetter: (params) =>
            params.row.openingTime || defaultOpeningDayTime.openingTime,
          renderEditCell: (params) => <TimeEditor {...params} />,
        },
        {
          width: 200,
          field: "closingTime",
          headerName: "Closing Time",
          sortable: false,
          hideable: false,
          valueGetter: (params) =>
            params.row.closingTime || defaultOpeningDayTime.closingTime,
          renderEditCell: (params) => <TimeEditor {...params} />,
        },
        {
          field: "allDay",
          headerName: "All day",
          sortable: false,
          hideable: false,
          renderCell: (params) => (
            <Checkbox
              checked={params.row.allDay}
              disabled={params.row.closed}
              onChange={(e) =>
                setOpeningTimes({
                  ...openingTimes,
                  [params.row.day]: {
                    ...openingTimes[params.row.day as Day],
                    allDay: e.target.checked,
                  },
                })
              }
            />
          ),
        },
        {
          field: "closed",
          headerName: "Closed",
          sortable: false,
          hideable: false,
          renderCell: (params) => (
            <Checkbox
              checked={params.row.closed}
              onChange={(e) =>
                setOpeningTimes({
                  ...openingTimes,
                  [params.row.day]: {
                    ...openingTimes[params.row.day as Day],
                    closed: e.target.checked,
                  },
                })
              }
            />
          ),
        },
      ]}
      rows={Object.entries(openingTimes).map(([day, times]) => ({
        day,
        ...times,
      }))}
      getRowId={(row) => row.day}
      processRowUpdate={(newRow) => {
        const { day, ...updatedDay } = newRow;

        setOpeningTimes({
          ...openingTimes,
          [newRow.day]: updatedDay,
        });

        return newRow;
      }}
      isCellEditable={(params) =>
        params.field === "closed" || (!params.row.allDay && !params.row.closed)
      }
      hideFooter
    />
  );
};
