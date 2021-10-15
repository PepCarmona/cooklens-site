import axios, { AxiosError, AxiosInstance } from 'axios';

export interface PaginatedResponse {
    result: any[];
    next: boolean;
}
export class Endpoint {
    private http: AxiosInstance;

    public constructor() {
        const token = localStorage.getItem('userToken') || '';

        this.http = axios.create({
            headers: { 'x-access-token': token },
        });

        this.http.interceptors.response.use(
            (response) => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response) {
                    console.error(
                        'API ERROR:',
                        error.response.data.message,
                        error.response.data.err ?? ''
                    );
                    return Promise.reject(error.response.data.message);
                }
            }
        );
    }

    public async get(path: string): Promise<any> {
        const result = await this.http.get(path);
        return result.data;
    }

    public async post(path: string, data: any): Promise<any> {
        const result = await this.http.post(path, data);
        return result.data;
    }

    public async put(path: string, data: any): Promise<any> {
        const result = await this.http.put(path, data);
        return result.data;
    }

    public async delete(path: string): Promise<any> {
        const result = await this.http.delete(path);
        return result.data;
    }
}
