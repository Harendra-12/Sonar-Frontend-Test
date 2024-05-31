import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { generalGetFunction } from './globalFunction'

function GlobalCalls() {
    const account = useSelector((state)=>state.account)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
        if(account && account.account_id){
            async function getData(){
                const apiData = await generalGetFunction(`/call-details?account=${account.account_id}`)
                if(apiData.status){
                    dispatch({
                        type:"SET_ALLCALL",
                        allCall:apiData.data
                    })
                }
            }
            getData()
        }else{
            navigate("/")
        }
    },[account, dispatch, navigate])
  return (
    <div>
    </div>
  )
}

export default GlobalCalls
