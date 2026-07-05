import { Resource } from './Resource.js';
import { Image } from './Image.js';

import type { LxdImagesResponse, LxdImageResponse, LxdImagesPost, LxdBaseResponse } from '../types';

export class Images extends Resource {
	/**
	 * Get a list of all images.
	 */
	async list(project?: string): Promise<LxdImagesResponse> {
		return this.client.request({
			method: 'GET',
			path: `/1.0/images${project ? `?project=${project}` : ''}`
		});
	}

	/**
	 * Get a specific image by fingerprint.
	 */
	async get(fingerprint: string, project?: string): Promise<Image> {
		const data = (await this.client.request({
			method: 'GET',
			path: `/1.0/images/${fingerprint}${project ? `?project=${project}` : ''}`
		})) as LxdImageResponse;
		return new Image(this.client, data);
	}

	/**
	 * Create a new image.
	 */
	async post(config: LxdImagesPost, project?: string): Promise<LxdBaseResponse<unknown>> {
		return this.client.request({
			method: 'POST',
			path: `/1.0/images${project ? `?project=${project}` : ''}`,
			body: config
		});
	}
}
