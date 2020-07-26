import React, { memo } from 'react';
import { CharUnitSquare } from "./CharUnitSquare"
import { Grid } from '@material-ui/core';
import { PositionModel } from '../../models';

interface LineUnitSquareProps 
{ line: string; rowId: number; currentBDPosition: PositionModel; }
export const LineUnitSquare = memo((props: LineUnitSquareProps) => {
    const {line, rowId, currentBDPosition} = props;
    return (
        <Grid container direction="row" justify="center" spacing={0}>
            {line.split('').map((character: string, i: number) => (
                <Grid key={i} item xs={"auto"}>
                    <CharUnitSquare character={character as string}
                                    position={{x: i, y: rowId} as PositionModel}
                                    bulldozerPos={currentBDPosition}/>
                </Grid>
            ))}
        </Grid>

    )
})
