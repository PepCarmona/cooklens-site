import axios, { AxiosError, AxiosInstance } from 'axios';

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
		return this.http
			.get(path)
			.then((result) => result.data)
			.catch((err) => Promise.reject(err));
	}

	public async post(path: string, data: any): Promise<any> {
		return this.http
			.post(path, data)
			.then((result) => result.data)
			.catch((err) => Promise.reject(err));
	}

	public async put(path: string, data: any): Promise<any> {
		return this.http
			.put(path, data)
			.then((result) => result.data)
			.catch((err) => Promise.reject(err));
	}

	public async delete(path: string): Promise<any> {
		return this.http
			.delete(path)
			.then((result) => result.data)
			.catch((err) => Promise.reject(err));
	}
}
