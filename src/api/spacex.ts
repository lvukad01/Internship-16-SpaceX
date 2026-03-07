import axios from 'axios'
import type { Launch, QueryResponse, Rocket, Ship } from '../types/spacex'

const BASE_URL='https://api.spacexdata.com/v4'

export const fetchLaunches = async (page: number = 1, search: string = "", status: string = "all") : Promise<QueryResponse<Launch>> => {
  const query: any = {
    name: { $regex: search, $options: 'i' }
  };

  if (status === "success") {
    query.success = true;
    query.upcoming = false; 
  } else if (status === "failed") {
    query.success = false;
    query.upcoming = false; 
  } else if (status === "upcoming") {
    query.upcoming = true;   
  }

  const response = await axios.post(`${BASE_URL}/launches/query`, {
    query,
    options: {
      limit: 10,
      page,
      sort: { date_utc: 'desc' }
    }
  });
  return response.data;
};

export const fetchLaunchById = async (id: string): Promise<Launch> => {
  const response = await axios.get(`${BASE_URL}/launches/${id}`);
  return response.data;
};

export const fetchRocketById=async (rocketid: string): Promise<Rocket> => {
  const response = await axios.get(`${BASE_URL}/rockets/${rocketid}`);
  return response.data;
};

export const fetchShips=async(page:number,search:string=""):Promise<QueryResponse<Ship>>=>{
    const response=await axios.post(`${BASE_URL}/ships/query`,{
        query: {
          name: { $regex: search, $options: 'i' }
        },
        options: {
        limit: 10,
        page: page,
    }
    })
    return response.data;
};

export const fetchShipById = async (id: string): Promise<Ship> => {
  const response = await axios.get(`${BASE_URL}/ships/${id}`);
  return response.data;
};