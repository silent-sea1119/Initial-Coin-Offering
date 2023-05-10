import "./App.css";
import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import { ethers } from 'ethers';
import contract from './contracts/ICO.json';
import contract_address from './contracts/contract-address.json';

const address = contract_address.ICO;
const abi = contract.abi;

const useStyles = makeStyles({
  root: {
    height: 15,
    borderRadius: 10,
  },
  cardSize: {
    border: '2px solid lightgray',
    maxWidth: 1000,
    maxHeight: 1000,
    margin: "auto"
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
    width: 0,
    display: "flex",
    alignItems: "self-end",
    justifyContent: "center",
  },
});

function App() {
  const [buttonName, setButtonName] = useState("Deposit");
  const [softCap, setSoftCap] = useState(0);
  const [hardCap, setHardCap] = useState(0);
  // const [totalCap, setTotalCap] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [amount, setAmount] = useState("0");
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [myDeposit, setMyDeposit] = useState(0);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [color, setColor] = useState("primary");
  const [endICO, setEndICO] = useState(false);
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

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
    } else {
      console.log('Wallet exists! We\'re ready to go!');
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account! Address: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account Found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('plz install Metamask!');
    }
    try {
      console.log(ethereum);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const disconnectWalletHandler = () => {
    setCurrentAccount(null);
  }

  const transactionHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");//Web3Provider(ethereum);
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const icoContract = new ethers.Contract(address, abi, signer);
        let icoTxn;

        if (buttonName === 'Deposit') {
          icoTxn = await icoContract.deposit({ value: ethers.utils.parseEther(amount) });//ethers.utils.parseEther(amount)});
        } else if (buttonName === 'Withdraw') {
          icoTxn = await icoContract.withdraw();
        } else {
          icoTxn = await icoContract.claim();
        }
        await icoTxn.wait();

        console.log(`Mined, see transaction: ${icoTxn.hash}`);

        icoContract.totalMoney().then(totalMoney => {
          setTotalDeposit(parseInt(totalMoney) / (10 ** 18));
        });
        icoContract.myDeposit().then(myDeposit => {
          setMyDeposit(parseInt(myDeposit) / (10 ** 18));
        });
        if (buttonName !== 'Deposit') setEndICO(true);

      } else {
        console.log("Ethereum object do not exist!");
      }
    } catch (err) {
      alert(err.reason);
      console.log(err.reason);
    }
  }

  const connectWalletButton = () => {
    return (
      <Button onClick={connectWalletHandler} variant="contained" color="primary">
        Connect to your wallet
      </Button>
    )
  }

  const disconnectWalletButton = () => {
    return (
      <Button onClick={disconnectWalletHandler} variant="contained" color="warning">
        Disconnect
      </Button>
    )
  }

  const inputAmountHandler = (e) => {
    console.log(e.target.value);
    setAmount(e.target.value);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");//Web3Provider(ethereum);
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const icoContract = new ethers.Contract(address, abi, signer);
        icoContract.totalMoney().then(totalMoney => {
          console.log(totalMoney);
          setTotalDeposit(parseInt(totalMoney) / (10**18));
        });
      } else {
        console.log("Ethereum object do not exist!");
      }
    }, 8000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    checkWalletIsConnected();
    const interval = setInterval(() => {
      setCurrentTime( new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      // const provider = new ethers.providers.Web3Provider(ethereum);
      const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");//Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const icoContract = new ethers.Contract(address, abi, signer);
      icoContract.totalMoney().then(totalMoney => {
        setTotalDeposit(parseInt(totalMoney) / (10 ** 18));
      });
      icoContract.myDeposit().then(myDeposit => {
        setMyDeposit(parseInt(myDeposit) / (10 ** 18));
      });
      icoContract.startTime().then(startTime => {
        const timestamp = parseInt(startTime) * 1000;
        const date = new Date(timestamp);
        setStartTime(date.toLocaleString());
      });
      icoContract.endTime().then(endTime => {
        const timestamp = parseInt(endTime) * 1000;
        const date = new Date(timestamp);
        setEndTime(date.toLocaleString());
      });
      icoContract.softCap().then(softCap => {
        setSoftCap(parseInt(softCap) / (10 ** 18));
      });
      icoContract.hardCap().then(hardcap => {
        setHardCap(parseInt(hardcap) / (10 ** 18));
      });
      // icoContract.totalToken().then(totalToken => {
      //   setTotalCap(totalToken);
      // });
    } else {
      console.log("Ethereum object do not exist!");
    }
  }, []);

  useEffect(() => {
    if (currentTime > endTime && softCap > totalDeposit) {
      setButtonName("Withdraw");
    } else if (currentTime > endTime && softCap <= totalDeposit) {
      setButtonName("Claim");
    } else {
      setButtonName("Deposit");
    }
  }, [currentTime, totalDeposit, endTime, softCap]);

  return (
    <div className="App">
      <Card className={classes.cardSize}>
        <div className="App-currentTime">
          <h2>Current Time: {currentTime.toLocaleString()}</h2>
          {currentAccount ? disconnectWalletButton() : connectWalletButton()}
        </div>
        <div className="App-inputButton">
          {buttonName === 'Deposit' ?
            <TextField
              label="Enter the amount"
              type="number"
              variant="outlined"
              color="default"
              margin="dense"
              value={amount}
              onChange={inputAmountHandler}
            /> : <></>}
          <Button onClick={transactionHandler} variant="contained" color="primary" disabled = { currentTime < startTime || !currentAccount || endICO }>
            {buttonName}
          </Button>
        </div>
        <div>
          <h3>Total deposit: {totalDeposit}ETH</h3>
          <h3>My deposit: {myDeposit}ETH</h3>
        </div>
        <div className="App-progressBar">
          <ThemeProvider theme={theme}>
            <div className="App-marks">
              <div
                className={classes.marker}
                style={{ left: '80%' }}
              >
                <h3>{`Softcap (${softCap}ETH)`}</h3>
              </div>
              <div className={classes.marker} style={{ left: '100%' }}>
                <h3>{`Hardcap (${hardCap}ETH)`}</h3>
              </div>
            </div>
            <LinearProgress
              variant="determinate"
              value={totalDeposit < 0.1 ? 800 * totalDeposit : (200 * totalDeposit + 1500) / 19}
              color={color}
              classes={{ root: classes.root }}
            />
          </ThemeProvider>
          <div className="App-marks">
            <div className={classes.time} style={{ left: `${0}%` }}>
              <h3>{startTime}</h3>
            </div>
            <div className={classes.time} style={{ left: `${100}%` }}>
              <h3>{endTime}</h3>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
export default App;
