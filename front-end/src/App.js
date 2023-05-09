import "./App.css";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    height: 15,
    borderRadius: 10,
  },
  marker: {
    position: "relative",
    transform: "translateX(-50%)",
    width: 1,
    height: 1,
    borderRadius: "50%",
    backgroundColor: "#2196f3",
    boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
    display: 'flex',
    paddingTop: "1%",
    alignItems: 'self-end',
    justifyContent: 'center',
  }, 
  time: {
    position: "relative",
    transform: "translateX(-50%)",
    width: 0,
    display: 'flex',
    alignItems: 'self-end',
    justifyContent: 'center',
  }
});

function App() {
  const totalDeposite = 2000;
  const myDeposite = 200;
  const softCap = 3000;
  const hardCap = 4000;
  const startDate = 'xx/yy/zz';
  const endDate = 'xx/yy/zz';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("primary");
  const classes = useStyles();
  const theme = createTheme ({
    palette: {
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 5
      );
      // if (progress > 75) {
      //   setColor("secondary");
      // }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="App-currentTime">
        <h2>Current Time: {currentTime.toLocaleString()}</h2>
        <Button variant="contained" color="primary">
          Connect to your wallet
        </Button>
      </div>
      <div className="App-inputButton">
        <TextField
          label="Enter the amount"
          type="number"
          variant="outlined"
          color="default"
          margin="dense"
          // value={text}
          // onChange={handleChange}
        />
        <Button variant="contained" color="primary">
          Deposite
        </Button>
      </div>
      <div>
        <h3>Total deposite: {totalDeposite}</h3>
        <h3>My deposite: {myDeposite}</h3>
      </div>
      <div className="App-progressBar">
        <ThemeProvider theme={theme}>
          <div className="App-marks">
            <div
              className={classes.marker}
              style={{ left: `${(softCap / hardCap) * 100}%` }}
            >
              <h3>Softcap</h3>
            </div>
            <div className={classes.marker} style={{ left: `${100}%` }}>
              <h3>Hardcap</h3>
            </div>
          </div>
          <LinearProgress 
            variant="determinate"
            value={80}
            color={color}
            classes={{ root: classes.root }}
          />
        </ThemeProvider>
        <div className="App-marks">
            <div
              className={classes.time}
              style={{ left: `${0}%` }}
            >
              <h3>{startDate}</h3>
            </div>
            <div className={classes.time} style={{ left: `${100}%` }}>
              <h3>{endDate}</h3>
            </div>
          </div>
      </div>
    </div>
  );
}
export default App;
