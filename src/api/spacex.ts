import axios from 'axios'
import type { Launch, QueryResponse } from '../types/spacex'

const BASE_URL='https://api.spacexdata.com/v4'

export const fetchLaunches=async(page:number=1):Promise<QueryResponse<Launch>>=>{
    const response=await axios.post(`${BASE_URL}/launches/query`,{
        query:{},
        options:{
            limit:10,
            page:page,
            sort: { date_utc: 'desc' }
        }
    })
    return response.data
}