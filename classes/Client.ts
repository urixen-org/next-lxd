import { request, Agent } from 'node:https';
import type { IncomingHttpHeaders } from 'node:http';
import type { LxdServerResponse } from '../types/index.d.ts';

export interface ClientOptions {
	url: string;
	cert: string | Buffer;
	key: string | Buffer;
	ca?: string | Buffer;
	password?: string;
	allowInsecure?: boolean;
}

export interface RequestOptions {
	method?: string;
	path: string;
	headers?: Record<string, any>;
	body?: unknown;
}

export interface RawResponse<T> {
	status: number;
	statusMessage: string;
	headers: IncomingHttpHeaders;
	body: T;
}

export class Client {
	public readonly url: URL;
  private readonly agent: Agent;
  public readonly clientInfo: {
    cert: string ;
    key: string ;
    ca?: string ;
    password?: string;
    allowInsecure?: boolean;
	}

	constructor(options: ClientOptions) {
		this.url = new URL(options.url);

		this.agent = new Agent({
			cert: options.cert,
			key: options.key,
			ca: options.ca,
			rejectUnauthorized: !options.allowInsecure,
			keepAlive: true
    });

		this.clientInfo = {
			cert: options.cert.toString(),
			key: options.key.toString(),
			ca: options.ca?.toString(),
			password: options.password?.toString(),
			allowInsecure: options?.allowInsecure,
		};
	}

	public async request<T>(options: RequestOptions): Promise<T> {
		const response = await this.requestRaw<T>(options);
		return response.body;
	}

	public requestRaw<T>({
		method = 'GET',
		path,
		headers = {},
		body
	}: RequestOptions): Promise<RawResponse<T>> {
		return new Promise((resolve, reject) => {
			const req = request(
				{
					protocol: this.url.protocol,
					hostname: this.url.hostname,
					port: this.url.port,
					path,
					method,
					agent: this.agent,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						...headers
					}
				},
				(res) => {
					let data = '';

					res.setEncoding('utf8');

					res.on('data', (chunk) => {
						data += chunk;
					});

					res.on('end', () => {
						if (!res.statusCode) {
							return reject(new Error('No status code received.'));
						}

						if (res.statusCode < 200 || res.statusCode >= 300) {
							return reject(
								new Error(`${res.statusCode} ${res.statusMessage}\n${data}`)
							);
						}

						let parsed: T;

						if (!data.length) {
							parsed = undefined as T;
						} else {
							try {
								parsed = JSON.parse(data);
							} catch {
								parsed = data as T;
							}
						}

						resolve({
							status: res.statusCode,
							statusMessage: res.statusMessage ?? '',
							headers: res.headers,
							body: parsed
						});
					});
				}
			);

			req.on('error', reject);

			if (body !== undefined) {
				req.write(JSON.stringify(body));
			}

			req.end();
		});
	}

	async connectionTest() {
		return this.request<LxdServerResponse>({
			path: '/1.0'
		});
	}
}
