import { Resource } from './Resource.js';
import { Client } from './Client.js';
import type {
  LxdImageResponse,
  LxdImagePut,
  LxdBaseResponse,
  LxdImageAliasesResponse,
  LxdImageAliasResponse,
  LxdImageAliasesPost,
  LxdImageAliasesEntryPut
} from '../types/index.d.ts';

export class Image extends Resource {
  public name: string;
  public metadata: LxdImageResponse['metadata'];

  constructor(client: Client, options: LxdImageResponse) {
    super(client);

    this.name = options.metadata.fingerprint;
    this.metadata = options.metadata;
  }

  async delete(): Promise<LxdBaseResponse<unknown>> {
    return this.client.request({
      method: 'DELETE',
      path: `/1.0/images/${this.name}`
    }) as Promise<LxdBaseResponse<unknown>>;
  }

  async put(data: LxdImagePut): Promise<LxdBaseResponse<unknown>> {
    return this.client.request({
      method: 'PUT',
      path: `/1.0/images/${this.name}`,
      body: data
    }) as Promise<LxdBaseResponse<unknown>>;
  }

  async patch(data: LxdImagePut): Promise<LxdBaseResponse<unknown>> {
    return this.client.request({
      method: 'PATCH',
      path: `/1.0/images/${this.name}`,
      body: data
    }) as Promise<LxdBaseResponse<unknown>>;
  }

  async refresh(): Promise<LxdBaseResponse<unknown>> {
    return this.client.request({
      method: 'POST',
      path: `/1.0/images/${this.name}/refresh`
    }) as Promise<LxdBaseResponse<unknown>>;
  }

  async export() {
    return this.client.requestRaw({
      method: 'GET',
      path: `/1.0/images/${this.name}/export`
    });
  }

  async secret(): Promise<LxdBaseResponse<{ secret: string }>> {
    return this.client.request({
      method: 'POST',
      path: `/1.0/images/${this.name}/secret`
    }) as Promise<LxdBaseResponse<{ secret: string }>>;
  }

  aliases = {
    list: async (): Promise<LxdImageAliasesResponse> => {
      return this.client.request({
        path: `/1.0/images/${this.name}/aliases`
      }) as Promise<LxdImageAliasesResponse>;
    },

    create: async (data: LxdImageAliasesPost): Promise<LxdBaseResponse<unknown>> => {
      return this.client.request({
        method: 'POST',
        path: `/1.0/images/${this.name}/aliases`,
        body: data
      }) as Promise<LxdBaseResponse<unknown>>;
    },

    entry: (name: string) => ({
      get: async (): Promise<LxdImageAliasResponse> => {
        return this.client.request({
          path: `/1.0/images/aliases/${name}`
        }) as Promise<LxdImageAliasResponse>;
      },

      put: async (data: LxdImageAliasesEntryPut): Promise<LxdBaseResponse<unknown>> => {
        return this.client.request({
          method: 'PUT',
          path: `/1.0/images/aliases/${name}`,
          body: data
        }) as Promise<LxdBaseResponse<unknown>>;
      },

      patch: async (data: LxdImageAliasesEntryPut): Promise<LxdBaseResponse<unknown>> => {
        return this.client.request({
          method: 'PATCH',
          path: `/1.0/images/aliases/${name}`,
          body: data
        }) as Promise<LxdBaseResponse<unknown>>;
      },

      delete: async (): Promise<LxdBaseResponse<unknown>> => {
        return this.client.request({
          method: 'DELETE',
          path: `/1.0/images/aliases/${name}`
        }) as Promise<LxdBaseResponse<unknown>>;
      }
    })
  };
}
