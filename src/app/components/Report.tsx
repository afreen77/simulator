import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface Item {
    name: string,
    quantity: number,
    cost: number
}

const total = (rows: Item[]) => rows.reduce((a, b) => ({
    name: 'Total',
    quantity: a.quantity || 0 + b.quantity || 0,
    cost: a.cost + b.cost
}), {name: 'Total', quantity: 0, cost: 0});

export const Report: React.FC<{ rows: Item[] }> = ({rows}) => {
    const totalItem = rows && total(rows);
    const newRows: Item[] = [...rows, totalItem];
    const classes = useStyles();
    if (rows.length === 0) {
        return (<></>)
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Command</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {newRows.map((row: Item) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.cost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
