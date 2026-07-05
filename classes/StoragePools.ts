import { Resource } from './Resource.js';
import { StoragePool } from './StoragePool.js';

import type {
	LxdStoragePoolsResponse,
	LxdStoragePoolResponse,
	LxdStoragePoolsPost
} from '../types';

export class StoragePools extends Resource {
	async list(project?: string): Promise<LxdStoragePoolsResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/storage-pools${project ? `?project=${project}` : ''}`
		});
	}

	async get(name: string, project?: string): Promise<StoragePool> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/storage-pools/${name}${project ? `?project=${project}` : ''}`
		})) as LxdStoragePoolResponse;
		return new StoragePool(this.client, data);
	}

	async post(config: LxdStoragePoolsPost, project?: string): Promise<StoragePool> {
		await this.client.request({
			method: 'POST',
			path: `/1.0/storage-pools${project ? `?project=${project}` : ''}`,
			body: config
		});
		return this.get(config.name, project);
	}
}
