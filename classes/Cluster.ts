import { Resource } from "./Resource.js";

import type {
  LxdClusterResponse,
  LxdClusterPut,
  LxdClusterCertificatePut,
  LxdClusterMembersResponse,
  LxdClusterMemberResponse,
  LxdClusterMemberPut,
  LxdClusterMemberPost,
  LxdClusterMemberStateResponse,
  LxdClusterMemberStatePost,
  LxdClusterMemberJoinToken,
  LxdClusterGroupsResponse,
  LxdClusterGroupResponse,
  LxdClusterGroupPut,
  LxdClusterGroupPost,
  LxdClusterGroupsPost,
  LxdBaseResponse,
  LxdClusterMembersPost,
} from "../types";

export class Cluster extends Resource {
  async get(): Promise<LxdClusterResponse> {
    return this.client.request({
      method: "GET",
      path: "/1.0/cluster",
    }) as Promise<LxdClusterResponse>;
  }

  async put(data: LxdClusterPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: "/1.0/cluster",
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async updateCertificate(data: LxdClusterCertificatePut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: "/1.0/cluster/certificate",
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  members = {
    list: async (): Promise<LxdClusterMembersResponse> => {
      return this.client.request({
        path: "/1.0/cluster/members",
      }) as Promise<LxdClusterMembersResponse>;
    },

    get: async (name: string): Promise<LxdClusterMemberResponse> => {
      return this.client.request({
        path: `/1.0/cluster/members/${name}`,
      }) as Promise<LxdClusterMemberResponse>;
    },

    put: async (name: string, data: LxdClusterMemberPut): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/cluster/members/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    patch: async (name: string, data: LxdClusterMemberPut): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PATCH",
        path: `/1.0/cluster/members/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    rename: async (name: string, data: LxdClusterMemberPost): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/cluster/members/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    delete: async (name: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/cluster/members/${name}`,
      }) as Promise<LxdBaseResponse<void>>;
    },

    state: async (name: string): Promise<LxdClusterMemberStateResponse> => {
      return this.client.request({
        path: `/1.0/cluster/members/${name}/state`,
      }) as Promise<LxdClusterMemberStateResponse>;
    },

    evacuate: async (name: string, data?: LxdClusterMemberStatePost): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/cluster/members/${name}/state`,
        body: data ?? { action: "evacuate" },
      }) as Promise<LxdBaseResponse<void>>;
    },

    restore: async (name: string, data?: LxdClusterMemberStatePost): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/cluster/members/${name}/state`,
        body: data ?? { action: "restore" },
      }) as Promise<LxdBaseResponse<void>>;
    },

    joinToken: async (data: LxdClusterMembersPost): Promise<LxdClusterMemberJoinToken> => {
      return this.client.request({
        method: "POST",
        path: "/1.0/cluster/members",
        body: data,
      }) as Promise<LxdClusterMemberJoinToken>;
    },
  };

  groups = {
    list: async (): Promise<LxdClusterGroupsResponse> => {
      return this.client.request({
        path: "/1.0/cluster/groups",
      }) as Promise<LxdClusterGroupsResponse>;
    },

    get: async (name: string): Promise<LxdClusterGroupResponse> => {
      return this.client.request({
        path: `/1.0/cluster/groups/${name}`,
      }) as Promise<LxdClusterGroupResponse>;
    },

    post: async (data: LxdClusterGroupsPost): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: "/1.0/cluster/groups",
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    put: async (name: string, data: LxdClusterGroupPut): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/cluster/groups/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    patch: async (name: string, data: LxdClusterGroupPut): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PATCH",
        path: `/1.0/cluster/groups/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    rename: async (name: string, data: LxdClusterGroupPost): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/cluster/groups/${name}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    delete: async (name: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/cluster/groups/${name}`,
      }) as Promise<LxdBaseResponse<void>>;
    },
  };
}
