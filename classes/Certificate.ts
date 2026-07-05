import { Resource } from "./Resource.js";
import { Client } from "./Client.js";

import type {
  LxdCertificateResponse,
  LxdCertificatePut,
  LxdBaseResponse,
} from "../types";

export class Certificate extends Resource {
  public fingerprint: string;
  public metadata: LxdCertificateResponse["metadata"];

  constructor(client: Client, options: LxdCertificateResponse) {
    super(client);

    this.fingerprint = options.metadata.fingerprint;
    this.metadata = options.metadata;
  }

  async delete(): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/certificates/${this.fingerprint}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async put(data: LxdCertificatePut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/certificates/${this.fingerprint}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async patch(data: LxdCertificatePut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PATCH",
      path: `/1.0/certificates/${this.fingerprint}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }
}
