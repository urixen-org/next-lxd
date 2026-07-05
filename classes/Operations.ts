import { Resource } from "./Resource.js";
import { Operation } from "./Operation.js";

import type {
  LxdOperationsResponse,
  LxdOperationResponse,
} from "../types";

export class Operations extends Resource {
  async list(project?: string): Promise<LxdOperationsResponse> {
    return this.client.request({
      method: "GET",
      path: `/1.0/operations${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdOperationsResponse>;
  }

  async get(id: string): Promise<Operation> {
    const data = await this.client.request({
      method: "GET",
      path: `/1.0/operations/${id}`,
    }) as LxdOperationResponse;
    return new Operation(this.client, data);
  }
}
