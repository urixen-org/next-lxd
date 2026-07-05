import { Resource } from "./Resource.js";
import { Client } from "./Client.js";

import type {
  LxdProfileResponse,
  LxdProfilePut,
  LxdProfilePost,
  LxdBaseResponse,
} from "../types";

export class Profile extends Resource {
  public name: string;
  public description: string;
  public metadata: LxdProfileResponse["metadata"];

  constructor(client: Client, options: LxdProfileResponse) {
    super(client);

    this.name = options.metadata.name;
    this.description = options.metadata.description || "";
    this.metadata = options.metadata;
  }

  async delete(project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/profiles/${this.name}${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async put(data: LxdProfilePut, project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/profiles/${this.name}${project ? `?project=${project}` : ""}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async patch(data: LxdProfilePut, project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PATCH",
      path: `/1.0/profiles/${this.name}${project ? `?project=${project}` : ""}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async post(data: LxdProfilePost, project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "POST",
      path: `/1.0/profiles/${this.name}${project ? `?project=${project}` : ""}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }
}
