import { makeStyles, Box } from "@material-ui/core";
import {
  LocalParkingRounded,
  DriveEta,
  ArrowForward,
} from "@material-ui/icons";
import React, { memo } from "react";

interface BDProps {
  parked: boolean;
}
const useStyles = makeStyles((theme) => ({
  bulldozer: {
    width: theme.spacing(10),
    height: theme.spacing(5)
  },
}));

export const BulldozerParking: React.FC<BDProps> = memo(({ parked }) => {
  const classes = useStyles();
  return (
    <Box border={1} className={classes.bulldozer}>
        <LocalParkingRounded />
          {parked && (
            <>
            <DriveEta fontSize="small" color="secondary" />
              <ArrowForward />
              </>
          )}
    </Box>
  );
});
