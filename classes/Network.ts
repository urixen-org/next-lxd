import { Resource } from "./Resource";
import { Client } from "./Client";

import type {
  LxdNetworkResponse,
  LxdNetworkPut,
  LxdBaseResponse,
  LxdNetworkLeasesResponse,
  LxdNetworkForwardsPost,
  LxdNetworkForwardPut,
  LxdNetworkForwardsResponse,
  LxdNetworkForwardResponse,
  LxdNetworkACLsPost,
  LxdNetworkACLPut,
  LxdNetworkACLsResponse,
  LxdNetworkACLResponse,
  LxdNetworkPeerPut,
  LxdNetworkPeersResponse,
  LxdNetworkPeerResponse,
} from "../types";

export class Network extends Resource {
  public name: string;
  public type: string;
  public managed: boolean;
  public metadata: LxdNetworkResponse["metadata"];

  constructor(client: Client, options: LxdNetworkResponse) {
    super(client);

    this.name = options.metadata.name;
    this.type = options.metadata.type;
    this.managed = options.metadata.managed;
    this.metadata = options.metadata;
  }

  async delete(project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/networks/${this.name}${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async put(data: LxdNetworkPut, project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/networks/${this.name}${project ? `?project=${project}` : ""}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async patch(data: LxdNetworkPut, project?: string): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PATCH",
      path: `/1.0/networks/${this.name}${project ? `?project=${project}` : ""}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async state(project?: string): Promise<LxdBaseResponse<Record<string, any>>> {
    return this.client.request({
      method: "GET",
      path: `/1.0/networks/${this.name}/state${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdBaseResponse<Record<string, any>>>;
  }

  async leases(project?: string): Promise<LxdNetworkLeasesResponse> {
    return this.client.request({
      method: "GET",
      path: `/1.0/networks/${this.name}/leases${project ? `?project=${project}` : ""}`,
    }) as Promise<LxdNetworkLeasesResponse>;
  }

  forwards = {
    list: async (project?: string): Promise<LxdNetworkForwardsResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/forwards${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkForwardsResponse>;
    },

    get: async (listenAddress: string, project?: string): Promise<LxdNetworkForwardResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/forwards/${listenAddress}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkForwardResponse>;
    },

    post: async (data: LxdNetworkForwardsPost, project?: string): Promise<LxdNetworkForwardResponse> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/networks/${this.name}/forwards${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdNetworkForwardResponse>;
    },

    put: async (listenAddress: string, data: LxdNetworkForwardPut, project?: string): Promise<LxdNetworkForwardResponse> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/networks/${this.name}/forwards/${listenAddress}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdNetworkForwardResponse>;
    },

    delete: async (listenAddress: string, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/networks/${this.name}/forwards/${listenAddress}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdBaseResponse<void>>;
    },
  };

  acls = {
    list: async (project?: string): Promise<LxdNetworkACLsResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/acls${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkACLsResponse>;
    },

    get: async (aclName: string, project?: string): Promise<LxdNetworkACLResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/acls/${aclName}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkACLResponse>;
    },

    post: async (data: LxdNetworkACLsPost, project?: string): Promise<LxdNetworkACLResponse> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/networks/${this.name}/acls${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdNetworkACLResponse>;
    },

    put: async (aclName: string, data: LxdNetworkACLPut, project?: string): Promise<LxdNetworkACLResponse> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/networks/${this.name}/acls/${aclName}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdNetworkACLResponse>;
    },

    delete: async (aclName: string, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/networks/${this.name}/acls/${aclName}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdBaseResponse<void>>;
    },
  };

  peers = {
    list: async (project?: string): Promise<LxdNetworkPeersResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/peers${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkPeersResponse>;
    },

    get: async (peerName: string, project?: string): Promise<LxdNetworkPeerResponse> => {
      return this.client.request({
        path: `/1.0/networks/${this.name}/peers/${peerName}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdNetworkPeerResponse>;
    },

    put: async (peerName: string, data: LxdNetworkPeerPut, project?: string): Promise<LxdNetworkPeerResponse> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/networks/${this.name}/peers/${peerName}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdNetworkPeerResponse>;
    },

    delete: async (peerName: string, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/networks/${this.name}/peers/${peerName}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdBaseResponse<void>>;
    },
  };
}
