import React, { useState,useEffect } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Form, Message } from "semantic-ui-react";

import {
  contractAddress
} from './../config'

import ABI from "./../web3/abi.json"

function App() {
    const [receiver,setReceiver] = useState('')
    const [amount,setAmount] = useState(null)
    const [txId,setTxId] = useState()

    const submit = async(e) => {
        e.preventDefault()
        if(receiver === null || amount === null)
          return
          
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const Contract = new ethers.Contract(contractAddress, ABI, signer)
        
        try {
            let transaction = await Contract.makeTransaction(receiver,{value: ethers.utils.parseEther(amount)})
            console.log(transaction)
            let tx = await transaction.wait()
            let event = tx.events[0]
            console.log(tx)
        } catch (er) {
            console.log(er)
        }
    }

    return (
      <div className="new-c-tx">
        <h1>Make a new Crypto Transaction</h1>
        <Form>
            <Form.Field>
                <label>Receiver</label>
                <input placeholder='Receiver' onChange={(e) => setReceiver(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Amount</label>
                <input placeholder='Amount' onChange={(e) => setAmount(e.target.value)} />
            </Form.Field>
            <Button type='submit' onClick={submit}>Make Transaction</Button>
        </Form>
        {
            txId && <Message>{`Transaction Id: ${txId}`}</Message>
        }
        <hr />
      </div>
    );
  }
  
  export default App;