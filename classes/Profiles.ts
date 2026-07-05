import { Resource } from './Resource.js';
import { Profile } from './Profile.js';

import type { LxdProfilesResponse, LxdProfileResponse, LxdProfilesPost } from '../types.js';

export class Profiles extends Resource {
	async list(project?: string): Promise<LxdProfilesResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/profiles${project ? `?project=${project}` : ''}`
		});
	}

	async get(name: string, project?: string): Promise<Profile> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/profiles/${name}${project ? `?project=${project}` : ''}`
		})) as LxdProfileResponse;
		return new Profile(this.client, data);
	}

	async post(config: LxdProfilesPost, project?: string): Promise<Profile> {
		await this.client.request({
			method: 'POST',
			path: `/1.0/profiles${project ? `?project=${project}` : ''}`,
			body: config
		});
		return this.get(config.name, project);
	}
}
