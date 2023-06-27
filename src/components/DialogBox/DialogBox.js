import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { loadStripe } from "@stripe/stripe-js";
import * as Yup from 'yup'
import axios from 'axios'
import constants from 'constants/constants'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'

import './DialogBox.css'
import 'react-toastify/dist/ReactToastify.css'

export default function DialogBox(props) {
  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [receivedAmount, setReceivedAmount] = React.useState('')
  const [baseCurrencyName, setBaseCurrencyName] = React.useState(props.title === 'Buy' ? 'Choose Currency' : props.name)
  const [exchangeCurrencyName, setExchangeCurrencyName] = React.useState(props.title === 'Sell' ? 'Choose Currency' : props.name)
  const [valid, setValid] = React.useState(false)
  const [ratioA, setRatioA] = React.useState(0) // The ratio of the currency to be sold to xUSD
  const [ratioB, setRatioB] = React.useState(props.title === 'Buy' ? props.ratio : 0) // The ratio of the currency to be bought to xUSD

  useEffect(() => {
    if (props.title === 'Sell') setExchangeCurrencyName('xUSD')
  }, [props.title])

  const schema = Yup.object({
    amount: Yup.number().required().positive().moreThan(0),
  })

  schema
    .isValid({
      amount,
    })
    .then(valid => {
      setValid(valid)
    })

  const handleConfirm = () => {
    if (valid === false) return toast.error('Wrong input')

    if (props.title === 'Deposit Funds') {
      const product = { // An object that contains the amount of funds to be deposited
        name: 'Deposit',
        price: Number(amount),
        productOwner: 'CryptoExchange',
        description: 'Fund Deposit',
        quantity: 1,
        currency: 'usd'
      }

      makePayment(product);
    } else {
      axios
        .post(
          'http://localhost:1234/transaction',
          {
            amount: Number(amount),
            baseCurrencyName,
            exchangeCurrencyName,
          },
          {
            withCredentials: true
          }
        ).then(response => {
          toast.success(response.data.message)
          handleClose()
        }).catch(error => {
          toast.error(error.response.data.message)
          handleClose()
          console.log(error)
        });
      
      axios.post(
        `${constants.baseURL}/currency-history`,
        {
          name: baseCurrencyName,
        },
        {
          withCredentials: true
        }
      );
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setAmount('')
    setReceivedAmount('')
  }

  // A function that initialises the payment process and redirects the user to the Stripe checkout page
  const makePayment = async(product) => {
		const stripe = await loadStripe("pk_test_51NHPT7Lcq4zXuPHdPewii7JSX2UL9TgCp0dCTFQKUyG8rajsyNRr1QQDXW4uXbUQw18ga0w2VPI6AxyxxIDX6IT20029I7KH0Y");
		const body = { product };
		const headers = {
			"Content-Type": "application/json",
		};

    const response = await axios.post(
      `${constants.baseURL}/funds`,
      {
        headers: headers,
        body: JSON.stringify(body),
      },
      {
        withCredentials: true
      }
    );

    const session = await response.data;
	
		const result = stripe.redirectToCheckout(
      {
			  sessionId: session.id,
		  }
    );

		if (result.error) {
			console.log(result.error);
		}
	};

  if (props.title === 'Sell' && ratioA === 0) {
    // Get the ratio of the currency to be sold to xUSD
    axios.get(
      `${constants.baseURL}/crypto/get?crypto=${props.name}`,
      {
        withCredentials: true,
      }
    ).then(response => {
      setRatioA(response.data.ratio);
    }).catch(error => {
      console.log(error)
    });
  }

  return (
    <div className="dialog">
      {/* <ToastContainer /> */}
      {
        props.title === 'Deposit Funds' ? (
          <div className='fab'>
            <Fab color="primary" aria-label="add" onClick={handleClickOpen} sx={{
              gridArea: 'fab',
              gridColumn: 3,
              marginRight: 3,
              marginBottom: 3,
            }}>
              <AddIcon className="addIcon" />
            </Fab>
          </div>
        ) :
          <Button variant="contained" color={props.title === 'Buy' ? 'primary' : 'secondary'} onClick={handleClickOpen}>
            {props.title}
          </Button>
      }

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <hr></hr>
        <DialogContent>
          {props.title === 'Buy' ? (
            <div>
              <div className="container">
                <div className="textField amountBox">
                  <TextField
                    variant="outlined"
                    label="I want to spend"
                    fullWidth
                    size="medium"
                    name="amount"
                    value={amount}
                    onChange={event => {
                      setAmount(event.target.value)
                      setReceivedAmount(event.target.value * ratioA / ratioB)
                    }}
                  />
                </div>
                <div className="textField currencyBox">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                      className='select'
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="baseCurrencyName"
                      value={baseCurrencyName}
                      label="Currency"
                      onChange={event => {
                        setBaseCurrencyName(event.target.value)

                        axios.get(
                          `${constants.baseURL}/crypto/get?crypto=${event.target.value}`,
                          {
                            withCredentials: true,
                          }
                        ).then(response => {
                          setRatioA(response.data.ratio);
                        }).catch(error => {
                          console.log(error)
                        });
                      }}
                    >
                      <MenuItem value={'xUSD'}>xUSD</MenuItem>
                      <MenuItem value={'Ethereum'}>Ethereum</MenuItem>
                      <MenuItem value={'Tether'}>Tether</MenuItem>
                      <MenuItem value={'Bitcoin'}>Bitcoin</MenuItem>
                      <MenuItem value={'BNB'}>BNB</MenuItem>
                      <MenuItem value={'USD Coin'}>USD Coin</MenuItem>
                      <MenuItem value={'XRP'}>XRP</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="container">
                <div className="textField amountBox">
                  <TextField
                    variant="outlined"
                    label="I want to buy"
                    fullWidth
                    size="medium"
                    name="receivedAmount"
                    value={receivedAmount}
                    onChange={event => {
                      setReceivedAmount(event.target.value)
                      setAmount(event.target.value * ratioB / ratioA)
                    }}
                  />
                </div>
                <div className="textField currencyBox">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="exchangeCurrencyName"
                      value={exchangeCurrencyName}
                      label="Currency"
                      onChange={event => {
                        setExchangeCurrencyName(event.target.value);

                        axios.get(
                          `${constants.baseURL}/crypto/get?crypto=${event.target.value}`,
                          {
                            withCredentials: true,
                          }
                        ).then(response => {
                          setRatioB(response.data.ratio);
                        }).catch(error => {
                          console.log(error)
                        });
                      }}
                    >
                      <MenuItem value={'xUSD'}>xUSD</MenuItem>
                      <MenuItem value={'Ethereum'}>Ethereum</MenuItem>
                      <MenuItem value={'Tether'}>Tether</MenuItem>
                      <MenuItem value={'Bitcoin'}>Bitcoin</MenuItem>
                      <MenuItem value={'BNB'}>BNB</MenuItem>
                      <MenuItem value={'USD Coin'}>USD Coin</MenuItem>
                      <MenuItem value={'XRP'}>XRP</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          ) : props.title === 'Sell' ? (
            <div>
              <div className="container">
                <div className="textField amountBox">
                  <TextField
                    variant="outlined"
                    label="I want to sell"
                    fullWidth
                    size="medium"
                    name="amount"
                    value={amount}
                    onChange={event => {
                      setAmount(event.target.value)
                      setReceivedAmount(event.target.value * ratioA)
                    }}
                  />
                </div>
                <div className="textField currencyBox">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="baseCurrencyName"
                      value={baseCurrencyName}
                      label="Currency"
                      onChange={event => {
                        setBaseCurrencyName(event.target.value);

                        axios.get(
                          `${constants.baseURL}/crypto/get?crypto=${event.target.value}`,
                          {
                            withCredentials: true,
                          }
                        ).then(response => {
                          setRatioA(response.data.ratio);
                          setReceivedAmount(amount * response.data.ratio);
                        }).catch(error => {
                          console.log(error)
                        });
                      }}
                    >
                      <MenuItem value={'Bitcoin'}>Bitcoin</MenuItem>
                      <MenuItem value={'Ethereum'}>Ethereum</MenuItem>
                      <MenuItem value={'Tether'}>Tether</MenuItem>
                      <MenuItem value={'BNB'}>BNB</MenuItem>
                      <MenuItem value={'USD Coin'}>USD Coin</MenuItem>
                      <MenuItem value={'XRP'}>XRP</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="textField">
                <TextField
                  disabled
                  variant="outlined"
                  label="You will receive"
                  fullWidth
                  size="medium"
                  placeholder="xUSD"
                  name="receivedAmount"
                  value={receivedAmount + ' xUSD'}
                />
              </div>
            </div>
          ) : props.title === 'Deposit Funds' ? (
            <div className="textField">
              <TextField
                variant="outlined"
                label="Amount"
                fullWidth
                size="medium"
                placeholder="xUSD"
                name="amount"
                value={amount}
                onChange={event => {
                  setAmount(event.target.value)
                }}
              />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
