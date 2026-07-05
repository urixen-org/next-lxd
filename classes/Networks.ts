import { Resource } from './Resource.js';
import { Network } from './Network.js';

import type { LxdNetworksResponse, LxdNetworkResponse, LxdNetworksPost } from '../types';

export class Networks extends Resource {
	async list(project?: string): Promise<LxdNetworksResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/networks${project ? `?project=${project}` : ''}`
		});
	}

	async get(name: string, project?: string): Promise<Network> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/networks/${name}${project ? `?project=${project}` : ''}`
		})) as LxdNetworkResponse;
		return new Network(this.client, data);
	}

	async post(config: LxdNetworksPost, project?: string): Promise<Network> {
		await this.client.request({
			method: 'POST',
			path: `/1.0/networks${project ? `?project=${project}` : ''}`,
			body: config
		});
		return this.get(config.name, project);
	}
}
