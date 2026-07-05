import { Resource } from "./Resource.js";
import { Client } from "./Client.js";

import type {
  LxdStoragePoolResponse,
  LxdStoragePoolPut,
  LxdBaseResponse,
  LxdStorageVolumesResponse,
  LxdStorageVolumeResponse,
  LxdStorageVolumesPost,
  LxdStorageVolumePut,
  LxdStorageVolumePost,
  LxdStorageVolumeSnapshotsResponse,
  LxdStorageVolumeSnapshotResponse,
  LxdStorageVolumeSnapshotsPost,
  LxdStorageVolumeSnapshotPut,
  LxdStorageVolumeSnapshotPost,
} from "../types/index.d.js";

export class StoragePool extends Resource {
  public name: string;
  public driver: string;
  public metadata: LxdStoragePoolResponse["metadata"];

  constructor(client: Client, options: LxdStoragePoolResponse) {
    super(client);

    this.name = options.metadata.name;
    this.driver = options.metadata.driver;
    this.metadata = options.metadata;
  }

  async delete(): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "DELETE",
      path: `/1.0/storage-pools/${this.name}`,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async put(data: LxdStoragePoolPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PUT",
      path: `/1.0/storage-pools/${this.name}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async patch(data: LxdStoragePoolPut): Promise<LxdBaseResponse<void>> {
    return this.client.request({
      method: "PATCH",
      path: `/1.0/storage-pools/${this.name}`,
      body: data,
    }) as Promise<LxdBaseResponse<void>>;
  }

  async resources() {
    return this.client.request({
      method: "GET",
      path: `/1.0/storage-pools/${this.name}/resources`,
    });
  }

  volumes = {
    list: async (project?: string): Promise<LxdStorageVolumesResponse> => {
      return this.client.request({
        path: `/1.0/storage-pools/${this.name}/volumes${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdStorageVolumesResponse>;
    },

    get: async (type: string, name: string, project?: string): Promise<LxdStorageVolumeResponse> => {
      return this.client.request({
        path: `/1.0/storage-pools/${this.name}/volumes/${type}/${name}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdStorageVolumeResponse>;
    },

    post: async (type: string, data: LxdStorageVolumesPost, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/storage-pools/${this.name}/volumes/${type}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    put: async (type: string, name: string, data: LxdStorageVolumePut, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PUT",
        path: `/1.0/storage-pools/${this.name}/volumes/${type}/${name}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    patch: async (type: string, name: string, data: LxdStorageVolumePut, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "PATCH",
        path: `/1.0/storage-pools/${this.name}/volumes/${type}/${name}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    delete: async (type: string, name: string, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "DELETE",
        path: `/1.0/storage-pools/${this.name}/volumes/${type}/${name}${project ? `?project=${project}` : ""}`,
      }) as Promise<LxdBaseResponse<void>>;
    },

    rename: async (type: string, name: string, data: LxdStorageVolumePost, project?: string): Promise<LxdBaseResponse<void>> => {
      return this.client.request({
        method: "POST",
        path: `/1.0/storage-pools/${this.name}/volumes/${type}/${name}${project ? `?project=${project}` : ""}`,
        body: data,
      }) as Promise<LxdBaseResponse<void>>;
    },

    snapshots: {
      list: async (type: string, volumeName: string, project?: string): Promise<LxdStorageVolumeSnapshotsResponse> => {
        return this.client.request({
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots${project ? `?project=${project}` : ""}`,
        }) as Promise<LxdStorageVolumeSnapshotsResponse>;
      },

      get: async (type: string, volumeName: string, snapshotName: string, project?: string): Promise<LxdStorageVolumeSnapshotResponse> => {
        return this.client.request({
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots/${snapshotName}${project ? `?project=${project}` : ""}`,
        }) as Promise<LxdStorageVolumeSnapshotResponse>;
      },

      post: async (type: string, volumeName: string, data: LxdStorageVolumeSnapshotsPost, project?: string): Promise<LxdBaseResponse<void>> => {
        return this.client.request({
          method: "POST",
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots${project ? `?project=${project}` : ""}`,
          body: data,
        }) as Promise<LxdBaseResponse<void>>;
      },

      put: async (type: string, volumeName: string, snapshotName: string, data: LxdStorageVolumeSnapshotPut, project?: string): Promise<LxdBaseResponse<void>> => {
        return this.client.request({
          method: "PUT",
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots/${snapshotName}${project ? `?project=${project}` : ""}`,
          body: data,
        }) as Promise<LxdBaseResponse<void>>;
      },

      delete: async (type: string, volumeName: string, snapshotName: string, project?: string): Promise<LxdBaseResponse<void>> => {
        return this.client.request({
          method: "DELETE",
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots/${snapshotName}${project ? `?project=${project}` : ""}`,
        }) as Promise<LxdBaseResponse<void>>;
      },

      rename: async (type: string, volumeName: string, snapshotName: string, data: LxdStorageVolumeSnapshotPost, project?: string): Promise<LxdBaseResponse<void>> => {
        return this.client.request({
          method: "POST",
          path: `/1.0/storage-pools/${this.name}/volumes/${type}/${volumeName}/snapshots/${snapshotName}${project ? `?project=${project}` : ""}`,
          body: data,
        }) as Promise<LxdBaseResponse<void>>;
      },
    },
  };
}
