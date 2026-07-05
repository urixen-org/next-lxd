import { Resource } from './Resource.js';
import { Project } from './Project.js';

import type { LxdProjectsResponse, LxdProjectResponse, LxdProjectsPost } from '../types.js';

export class Projects extends Resource {
	async list(project?: string): Promise<LxdProjectsResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/projects${project ? `?project=${project}` : ''}`
		});
	}

	async get(name: string, project?: string): Promise<Project> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/projects/${name}${project ? `?project=${project}` : ''}`
		})) as LxdProjectResponse;
		return new Project(this.client, data);
	}

	async post(config: LxdProjectsPost, project?: string): Promise<Project> {
		await this.client.request({
			method: 'POST',
			path: `/1.0/projects${project ? `?project=${project}` : ''}`,
			body: config
		});
		return this.get(config.name, project);
	}
}
