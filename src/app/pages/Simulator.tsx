import React, { useState, useReducer, useCallback } from "react";
import {
  FileUploader,
  LineUnitSquare,
  BulldozerParking,
  ControlPanel,
  Title,
} from "../../components";
import { Grid, Paper, Theme, createStyles } from "@material-ui/core";
import {
  PositionModel,
  CommandModel,
  initBulldozerPos,
  initialState,
} from "../../models";
import {
  getCurrentDirection,
  getXYCoordinate,
  calculateCost,
} from "../functions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

const reducer = (
  state: any,
  action: { type: string; payload: PositionModel | Map<number, string> }
) => {
  console.log(state);
  switch (action.type) {
    case "SITEMAP":
      return {
        ...state,
        sitemap: action.payload,
      };
    case "ADVANCE":
      return {
        ...state,
        bulldozerPos: action.payload,
        commandHistory: [...state.commandHistory, { ...action }],
      };
    case "LEFT":
      return {
        ...state,
        bulldozerPos: {
          ...state.bulldozerPos,
          face: getCurrentDirection(action.type, state.bulldozerPos),
        },
        commandHistory: [...state.commandHistory, { ...action }],
      };
    case "RIGHT":
      return {
        ...state,
        bulldozerPos: {
          ...state.bulldozerPos,
          face: getCurrentDirection(action.type, state.bulldozerPos),
        },
        commandHistory: [...state.commandHistory, { ...action }],
      };
    case "QUIT":
      const tmp = calculateCost(state.commandHistory, state.sitemap);
      console.log(tmp);
      return {
        ...state,
        report: calculateCost(state.commandHistory, state.sitemap),
      };
    default:
      throw new Error('Something went wrong');
  }
};

export const Simulator: React.FunctionComponent = () => {
  const [resultMap, setresultMap] = useState(new Map());
  const [boundary, setSiteMapBoundary] = useState({ x: 0, y: 0 });
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const showVehicleParked =
    state.bulldozerPos.x === 0 && state.bulldozerPos.y === 0;

  const createSiteMap = (arr: string[]) => {
    const charMapObject = new Map();
    arr
      .filter((line) => !!line)
      .map((line, index) => {
        charMapObject.set(index, line);
      });
    setresultMap(charMapObject);
    setSiteMapBoundary({ x: charMapObject.get(0).split('').length , y: charMapObject.size});
    dispatch({ type: "SITEMAP", payload: charMapObject });
  };
  const handleCommand = (args: CommandModel) => {
    const { type, step } = args;
    dispatch({
      type,
      payload: getXYCoordinate(type, state.bulldozerPos, boundary, step),
    });
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title getFileContent={createSiteMap} />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <ControlPanel handleCommand={handleCommand} />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
            <Grid item xs={2}>
              <BulldozerParking parked={showVehicleParked} />
            </Grid>
            {resultMap.size > 0 &&
              Array.from(resultMap.keys()).map((key) => (
                <LineUnitSquare
                  key={key}
                  line={resultMap.get(key)}
                  rowId={key}
                  currentBDPosition={state.bulldozerPos}
                />
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>{/* <Report> */}</Paper>
        </Grid>
      </Grid>
    </div>
  );
};
