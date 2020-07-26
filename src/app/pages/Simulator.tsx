import React, { useState, useReducer } from "react";
import {
  LineUnitSquare,
  BulldozerParking,
  ControlPanel,
  Title,
} from "../components";
import { Grid, Paper, Theme, createStyles } from "@material-ui/core";
import {
  CommandModel,
  initialState,
} from "../../models";
import {
  getXYCoordinate,
} from "../functions";
import { makeStyles } from "@material-ui/core/styles";
import {Report} from "../components/Report";
import {Alert, AlertTitle} from "@material-ui/lab";
import {simulatorReducer} from "../reducer";

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


export const Simulator: React.FunctionComponent = () => {
  const [resultMap, setresultMap] = useState(new Map());
  const [boundary, setSiteMapBoundary] = useState({ x: 0, y: 0 });
  const [error, setError] = useState({ error: false, message: '' });
  const [state, dispatch] = useReducer(simulatorReducer, initialState);
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
            <ControlPanel currentBDPosition={state.bulldozerPos} handleCommand={handleCommand} />
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
