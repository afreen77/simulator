import React, { useEffect, useState } from "react";
import {
  ClearAll,
  Nature,
  FilterHdr,
  DriveEta,
  ArrowForward,
} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Slide, Grid } from "@material-ui/core";
import { PositionModel } from "../../models";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  icon: {
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  bulldozer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
  },
  vehicle: {
    transition: theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.short,
    }),
  },
  East: {
    transform: "rotate(0)",
  },
  West: {
    transform: "rotate(-180deg)",
  },
  North: {
    transform: "rotate(-90deg)",
  },
  South: {
    transform: "rotate(90deg)",
  },
}));

const getIcon = (c: string, pos: PositionModel, styleClass: string) => {
  switch (c) {
    case "t":
      return <Nature fontSize="large" className={styleClass} color="primary" />;
    case "T":
      return (
        <Nature fontSize="large" className={styleClass} color="secondary" />
      );
    case "o":
      return (
        <ClearAll fontSize="large" className={styleClass} color="primary" />
      );
    case "r":
      return (
        <FilterHdr fontSize="large" className={styleClass} color="primary" />
      );
    default:
      return <></>;
  }
};

const getSlideDirection = (face: string) => {
  return face === "East"
    ? "right"
    : face === "West"
    ? "left"
    : face === "North"
    ? "down"
    : "up";
};
const getVehicle = (
  p1: PositionModel,
  p2: PositionModel,
  hideVehicle: boolean,
  styleClass: string
) => {
  if (p1.x === p2.x) {
    return p1.y < p2.y ? (
      <Slide
        direction={getSlideDirection(p1.face) || "right"}
        in={!hideVehicle}
        mountOnEnter
        unmountOnExit
      >
        <DriveEta fontSize="small" color="primary" />
      </Slide>
    ) : p1.y === p2.y ? (
      <>
        <DriveEta fontSize="small" color="secondary" />
        <ArrowForward className={styleClass} />
      </>
    ) : (
      <></>
    );
  }
};

export const CharUnitSquare = (props: any) => {
  const { position, bulldozerPos } = props;
  const [hideVehicle, setHideVehicle] = useState(false);
  const classes = useStyles();

  const vehicleClasses = [
    classes.vehicle,
    bulldozerPos.face === "East"
      ? classes.East
      : bulldozerPos.face === "West"
      ? classes.West
      : bulldozerPos.face === "North"
      ? classes.North
      : classes.South,
  ].join(" ");

  useEffect(() => {
    setTimeout(() => setHideVehicle(true), bulldozerPos.y * 1000);
  }, [bulldozerPos]);

  return (
    <Paper className={classes.paper} variant={"outlined"} square>
      <Grid item>
        <Paper elevation={0}>
          {getIcon(props.character, props.position, classes.icon)}
        </Paper>
      </Grid>
      <Grid item className={classes.bulldozer}>
        <Paper elevation={3}>
          {getVehicle(position, bulldozerPos, hideVehicle, vehicleClasses)}
        </Paper>
      </Grid>
    </Paper>
  );
};
