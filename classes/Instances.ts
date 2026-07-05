import { Resource } from './Resource.js';
import { Instance } from './Instance.js';

import type { LxdInstanceResponse, LxdInstancesResponse, InstanceCreateRequest } from '../types';

export class Instances extends Resource {
	/**
	 * Get a list of all instances.
	 */
	async list(project?: string): Promise<LxdInstancesResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/instances${project ? `?project=${project}` : ''}`
		});
	}

	/**
	 * Get the state and configuration of a specific instance.
	 */
	async get(name: string, project?: string): Promise<Instance> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/instances/${name}${project ? `?project=${project}` : ''}`
		})) as LxdInstanceResponse;
		return new Instance(this.client, data);
	}

	async post(config: InstanceCreateRequest, project?: string, target?: string): Promise<Instance> {
		const params = new URLSearchParams();

		if (project) params.set('project', project);
		if (target) params.set('target', target);

		const query = params.toString();

		await this.client.request({
			method: 'POST',
			path: `/1.0/instances${query ? `?${query}` : ''}`,
			body: config
		});

		return this.get(config.name, project);
	}
}
