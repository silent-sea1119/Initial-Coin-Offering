import "./App.css";
import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: 15,
    borderRadius: 10,
  },
  cardSize: {
    border: "2px solid lightgray",
    maxWidth: 1000,
    maxHeight: 1000,
    margin: "auto",
  },
  marker: {
    position: "relative",
    transform: "translateX(-50%)",
    width: 1,
    height: 1,
    borderRadius: "50%",
    backgroundColor: "#2196f3",
    boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
    display: "flex",
    paddingTop: "1%",
    alignItems: "self-end",
    justifyContent: "center",
  },
  time: {
    position: "relative",
    transform: "translateX(-50%)",
    fontSize: '13px',
    display: "flex",
    alignItems: "self-end",
    justifyContent: "center",
  },
  percentage: {
    position: "relative",
    transform: "translateX(-50%)",
    color: "black",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function App() {
  const totalDeposite = 2000;
  const myDeposite = 200;
  const softCap = 3000;
  const hardCap = 4000;
  const totalCap = 5000;
  const start = "Tue May 09 2023 09:00:00 GMT-0700 (Pacific Daylight Time)";
  const startDate = new Date(start);
  const formattedStartDate = `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} ${startDate.toLocaleTimeString("en-US", {hour12: false})} GMT`;
  const end = "Thu May 10 2023 09:00:00 GMT-0700 (Pacific Daylight Time)";
  const endDate = new Date(end);
  const formattedEndDate = `${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} ${endDate.toLocaleTimeString("en-US", {hour12: false})} GMT`;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("primary");
  const classes = useStyles();
  const theme = createTheme({
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
      <Card className={classes.cardSize}>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">ETH</InputAdornment>
              ),
            }}
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
                style={{ left: `${(softCap / totalCap) * 100}%` }}
              >
                <h3>Softcap</h3>
              </div>
              <div
                className={classes.marker}
                style={{ left: `${(hardCap / totalCap) * 100}%` }}
              >
                <h3>Hardcap</h3>
              </div>
            </div>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              classes={{ root: classes.root }}
            />
            <div
              className={classes.percentage}
              style={{ left: `${progress}%` }}
            >
              {progress}%
            </div>
          </ThemeProvider>
          <div className="App-marks">
            <div className={classes.time} style={{ left: `${6}%` }}>
              <h3>{formattedStartDate}</h3>
            </div>
            <div className={classes.time} style={{ left: `${73}%` }}>
              <h3>{formattedEndDate}</h3>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
export default App;
