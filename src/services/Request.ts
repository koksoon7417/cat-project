import axios from 'axios';

const API_URL = "https://api.thecatapi.com/v1";

const Request =  async <T>(
  url: string,
  params?: any,
): Promise<T> => {
  return axios
    .request<{ data: T }>({
      method: 'GET',
      url,
      params,
      baseURL: API_URL,
      responseType: "json",
      headers: {
        "x-Api-Key": process.env.REACT_APP_X_API_KEY || 'DEMO-API-KEY',
      }
    })
    .then((response: any) => {
      const { data } = response;
      return data;
    })
    .catch((err) => {
      if (err && err.isAxiosError) {
        const errResponse = err.response;

        if (errResponse) {
          const { data, status } = errResponse;
          const errMessage = data.message;

          console.log("SERVER ERROR: ", errMessage);

          switch (status) {
            case 400:
              console.error(errMessage);
              break
            default:
          }
        }
      }
    });
}

export default Request;
