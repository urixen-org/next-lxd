import { Resource } from "./Resource";
import { Client } from "./Client";

import type {
  LxdOperationResponse,
  LxdBaseResponse,
} from "../types";

export class Operation extends Resource {
  public id: string;
  public metadata: LxdOperationResponse["metadata"];

  constructor(client: Client, options: LxdOperationResponse) {
    super(client);

    this.id = options.metadata.id;
    this.metadata = options.metadata;
  }

  async wait(timeout?: number): Promise<LxdOperationResponse> {
    const params = timeout !== undefined ? `?timeout=${timeout}` : "";
    return this.client.request({
      method: "GET",
      path: `/1.0/operations/${this.id}/wait${params}`,
    }) as Promise<LxdOperationResponse>;
  }

  async cancel(): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/operations/${this.id}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  websocketUrl(secret?: string): string {
    const base = `${this.client.url.protocol}//${this.client.url.host}/1.0/operations/${this.id}/websocket`;
    return secret ? `${base}?secret=${secret}` : base;
  }
}
