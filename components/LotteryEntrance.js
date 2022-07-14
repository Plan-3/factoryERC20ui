import { React, useEffect, useState } from 'react'
import { useWeb3Contract } from "react-moralis"
import { abi, address } from "../constants/index.js"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

function LotteryEntrance() {
    const [tokenParams, setTokenParams] = useState({})
    const { chainId: chain, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chain)
    const dispatch = useNotification()
    const raffleAddress = chainId in address ? address[chainId][0] : null
    console.log(raffleAddress);
    const { data, error, runContractFunction: CreateRealEstateToken, isFetching, isLoading } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "CreateRealEstateToken",
            params: { name: tokenParams.token, symbol: tokenParams.symbol, _initialSupply: tokenParams.supply},
        
        })
    const handleChange = (event) => {
        const {name, value} = event.target
        setTokenParams({
            ...tokenParams,
            [name]: value
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setTokenParams({})
    }
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notis",
            position: "topR",
            icon: "bell"
        })
    }
    return (
        <div className='border-b2'>
                <form>
                    <input type="text" name='token' placeholder='Token Name' onChange={() => handleChange(event)}/>
                    <input type="text" name='symbol' placeholder='Token Symbol' onChange={() => handleChange(event)}/>
                    <input type="text" name='supply' placeholder='Initial Supply' onChange={() => handleChange(event)}/>
                    <button className='bg-blue-500 hover:bg-blue-700 rounded font-bold text-white ml-auto py-2 px-2 my-4'
                        onClick={async () => {
                            await CreateRealEstateToken({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                            handleSubmit();
                        }}
                        disabled={isLoading || isFetching}
                        
                    >
                        {isLoading || isFetching ? (<div className='animate-spin spinneer-bordder h-8 w-8 border-b-2 rounded-full'></div>
                        ) : (
                            <div>Create</div>
                        )}
                    </button>


                </form>
                
        </div>
    )
}

export default LotteryEntrance