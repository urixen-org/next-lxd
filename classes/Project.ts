import { Resource } from "./Resource";
import { Client } from "./Client";

import type {
  LxdProjectResponse,
  LxdProjectPut,
  LxdProjectPost,
  LxdProjectStateResponse,
  LxdBaseResponse,
} from "../types";

export class Project extends Resource {
  public name: string;
  public description: string;
  public metadata: LxdProjectResponse["metadata"];

  constructor(client: Client, options: LxdProjectResponse) {
    super(client);

    this.name = options.metadata.name;
    this.description = options.metadata.description || "";
    this.metadata = options.metadata;
  }

  async delete(force?: boolean): Promise<LxdBaseResponse<void>> {
    const params = force ? "?force=1" : "";
    return this.client.request({
      method: "DELETE",
      path: `/1.0/projects/${this.name}${params}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async put(data: LxdProjectPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/projects/${this.name}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async patch(data: LxdProjectPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PATCH",
      path: `/1.0/projects/${this.name}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async post(data: LxdProjectPost): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "POST",
      path: `/1.0/projects/${this.name}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async state(): Promise<LxdProjectStateResponse> {
    return this.client.request({
      method: "GET",
      path: `/1.0/projects/${this.name}/state`,
    }) as Promise<LxdProjectStateResponse>;
  }
}
