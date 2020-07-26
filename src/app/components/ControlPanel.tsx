import {Grid, Box,FilledInput, FormControl, FormHelperText, IconButton, makeStyles, Typography} from "@material-ui/core";
import {ChevronLeftRounded, ChevronRightRounded, ExitToAppRounded, FastForwardRounded} from "@material-ui/icons";
import React, {useState} from "react";
import {CommandModel, PositionModel} from "../../models";

const useStyles = makeStyles((theme) => ({
    textField: {
        margin: theme.spacing(1),
    },
}));

export const ControlPanel: React.FC<{ currentBDPosition: PositionModel, handleCommand: React.Dispatch<any> }> = ({
    currentBDPosition, handleCommand }) => {
    const classes = useStyles();
    const [step, setStep] = useState(0);

    const handleChange = (args: CommandModel) => {
        handleCommand(args);
    };
    return (
        <Box border={1} flexDirection="column" alignContent="centre">
            <Typography variant="h4" color="primary">
                {"Control Panel"}
            </Typography>
            <Box flexDirection="row" alignContent="centre" padding="0 8 em">

                <FormControl className={classes.textField} variant="filled">
                    <FilledInput
                        id="step-helper-text"
                        onChange={(e) =>
                            setStep(parseInt(e.target.value))
                        }
                        aria-describedby="step-helper-text"
                        inputProps={{
                            "aria-label": "step",
                        }}
                    />
                    <FormHelperText id="step-helper-text">
                        Number of steps to move forward
                    </FormHelperText>
                    <IconButton
                        size="medium"
                        aria-label="Move Forward"
                        onClick={() => handleChange({type: "ADVANCE", step: step})}
                    >
                        <FastForwardRounded fontSize="large" color={step ? "primary" : "disabled"}/>
                    </IconButton>
                    <Box border={1} flexDirection="row">

                        <IconButton
                            size="medium"
                            data-testid="left"
                            aria-label="Turn Left"
                            onClick={() => handleChange({type: "LEFT"})}
                        >
                            <ChevronLeftRounded fontSize="large" color={(currentBDPosition.x === -1) ? "disabled" : "primary"}/>
                        </IconButton>

                        <IconButton
                            size="medium"
                            aria-label="Turn Right"
                            onClick={() => handleChange({type: "RIGHT"})}
                        >
                            <ChevronRightRounded fontSize="large" color={(currentBDPosition.x === -1) ? "disabled" : "primary"}/>
                        </IconButton>
                    </Box>

                    <IconButton
                        size="medium"
                        aria-label="Quit"
                        onClick={() => handleChange({type: "QUIT"})}
                    >
                        <ExitToAppRounded fontSize="large" color="secondary"/>
                    </IconButton>
                </FormControl>


            </Box>


        </Box>
    );
};
