export interface QueryResponse<T> {
  docs: T[];         
  totalDocs: number;    
  limit: number;       
  totalPages: number;   
  page: number;         
  pagingCounter: number;
  hasPrevPage: boolean; 
  hasNextPage: boolean; 
  prevPage: number | null;
  nextPage: number | null;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  upcoming: boolean;
  details: string | null;
  flight_number: number;
  links: {
    patch: {
      small: string | null;
    };
    youtube_id: string | null;
  };
  rocket: string; 
}

export interface Rocket{
    id:string,
    name:string
}