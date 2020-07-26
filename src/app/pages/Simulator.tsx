import React, { useState, useReducer } from "react";
import {
  LineUnitSquare,
  BulldozerParking,
  ControlPanel,
  Title,
} from "../components";
import { Grid, Paper, Theme, createStyles } from "@material-ui/core";
import {
  PositionModel,
  CommandModel,
  initialState, Direction,
} from "../../models";
import {
  getCurrentDirection,
  getXYCoordinate,
  getVisitedCoordinates, calculateCost,
} from "../functions";
import { makeStyles } from "@material-ui/core/styles";
import {Report} from "../components/Report";
import {Alert, AlertTitle} from "@material-ui/lab";

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

  switch (action.type) {
    case "SITEMAP":
      return {
        ...state,
        sitemap: action.payload,
      };
    case "ADVANCE":
      // @ts-ignore
      const payload = action.payload as PositionModel;
      const advanceCommands = state.commandHistory.filter((a: CommandModel) => a.type === 'ADVANCE');
      const prevPosIndex = advanceCommands.length -1;
      const prevPos = advanceCommands[prevPosIndex]?.payload || { x: 0, y: 0, face: Direction.EAST };
      const visitedCoord = getVisitedCoordinates(payload,prevPos, state.sitemap);
      return {
        ...state,
        bulldozerPos: action.payload,
        commandHistory: [...state.commandHistory, { ...action, visitedCoordinates: visitedCoord }, ],
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
  const [error, setError] = useState({ error: false, message: '' });
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const showVehicleParked =
    state.bulldozerPos.x === -1 && state.bulldozerPos.y === -1;

  const createSiteMap = (arr: string[]) => {
    const charMapObject = new Map();
    arr.filter((line) => !!line)
        .map((line, index) => {
          charMapObject.set(index, line);
        });

    dispatch({ type: "SITEMAP", payload: charMapObject });
    setresultMap(charMapObject);

    setSiteMapBoundary({ x: charMapObject.get(0).length , y: charMapObject.size});
  };
  const showError = (message: string) => {
    // handleCommand({ type: 'QUIT' });
    setError({ error: true, message: message });
  }

  const handleCommand = (args: CommandModel) => {
    const { type, step } = args;
    dispatch({
      type,
      payload: getXYCoordinate(type, state.bulldozerPos, boundary, showError, state.sitemap, step),
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
            {!error.error && resultMap.size > 0 &&
              Array.from(resultMap.keys()).map((key) => (
                <LineUnitSquare
                  key={key}
                  line={resultMap.get(key)}
                  rowId={key}
                  currentBDPosition={state.bulldozerPos}
                />
              ))}
            { error.error &&
            (<Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error.message} — <strong>Please check the Cost report for clearing this land</strong>
            </Alert>)

            }
          </Paper>
        </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}><Report rows = { state.report }/></Paper>
          </Grid>
      </Grid>
    </div>
  );
};
