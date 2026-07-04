import { Resource } from './Resource';
import { Certificate } from './Certificate';

import type {
	LxdCertificatesResponse,
	LxdCertificateResponse,
	LxdCertificatesPost,
	LxdBaseResponse
} from '../types';

export class Certificates extends Resource {
	async list(): Promise<LxdCertificatesResponse> {
		return this.client.request({
			method: 'GET',
			path: '/1.0/certificates'
		}) as Promise<LxdCertificatesResponse>;
	}

	async get(fingerprint: string): Promise<Certificate> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/certificates/${fingerprint}`
		})) as LxdCertificateResponse;
		return new Certificate(this.client, data);
	}

	async post(config: LxdCertificatesPost): Promise<LxdBaseResponse<unknown>> {
		return this.client.request({
			method: 'POST',
			path: '/1.0/certificates',
			body: config
		});
	}
}
