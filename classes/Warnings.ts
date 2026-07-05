import { Resource } from "./Resource.js";

import type {
  LxdWarningsResponse,
  LxdWarningResponse,
  LxdWarningPut,
  LxdBaseResponse,
} from "../types.js";

export class Warnings extends Resource {
  async list(project?: string): Promise<LxdWarningsResponse> {
    return this.client.request({
      method: "GET",
      path: `/1.0/warnings${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdWarningsResponse>;
  }

  async get(uuid: string): Promise<LxdWarningResponse> {
    return this.client.request({
      method: "GET",
      path: `/1.0/warnings/${uuid}`,
    }) as Promise<LxdWarningResponse>;
  }

  async put(uuid: string, data: LxdWarningPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/warnings/${uuid}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async delete(uuid: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/warnings/${uuid}`,
    }) as Promise<LxdBaseResponse<void>>;
  }
}
