import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FileUploader } from './FileUploader';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  }
});

interface TitleProps {
  getFileContent: (arg0: string[]) => void
}
export const Title = (props: TitleProps) => {
  const { getFileContent } = props;
  const classes = useStyles();
   return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
      <Typography variant="h5" component="h2">
        ABC Construction Simulator
        </Typography>
        <Typography component="p" className={classes.title} color="textSecondary" gutterBottom>
        Please upload a .txt file in the following format having a few lines in the format of <b>oootttTrr</b>
            <div>
                The test input files can be found in root directory by the name input.txt
            </div>
        </Typography>
      </CardContent>
      <CardActions>
      <FileUploader handleFileLoaded={getFileContent}/>
      </CardActions>
    </Card>
  );
}
