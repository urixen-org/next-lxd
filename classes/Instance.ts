import { Resource } from './Resource.js';
import type {
	LxdInstanceResponse,
	LxdInstanceDeleteResponse,
	LxdInstanceConsoleResponse,
	LxdInstanceExecRequest,
	LxdInstanceExecResponse,
	LxdBaseResponse,
	LxdInstancePutRequest,
	LxdInstancePost,
	LxdInstanceRebuildPost,
	LxdInstanceStateResponse,
	LxdInstanceStatePut,
	LxdInstanceSnapshotsResponse,
	LxdInstanceSnapshotResponse,
	LxdInstanceSnapshotsPost,
	LxdInstanceSnapshotPut,
	LxdInstanceSnapshotPost,
	LxdInstanceBackupsResponse,
	LxdInstanceBackupResponse,
	LxdInstanceBackupsPost,
	LxdInstanceBackupPost
} from '../types/index.d.ts';
import { Client } from './Client.js';
import pkg from 'next-lxd-sftp';
const { nextConnect, nextDisconnect, nextReadDir, nextStat, nextLstat, nextReadLink, nextRealPath, nextGetwd, nextGlob, nextOpen, nextOpenFile, nextCreate, nextRead, nextWrite, nextCloseFile, nextRemove, nextRemoveDir, nextRename, nextPosixRename, nextMkdir, nextMkdirAll, nextChmod, nextChown, nextChtimes } = pkg;

export class Instance extends Resource {
	public name: string;
	public status: string;
	public metadata: LxdInstanceResponse['metadata'];
	public project?: string;

	constructor(client: Client, options: LxdInstanceResponse) {
		super(client);

		this.name = options.metadata.name;
		this.status = options.status;
		this.metadata = options.metadata;
		this.project = options.metadata.project;
	}

	async delete(): Promise<LxdInstanceDeleteResponse> {
		return this.client.request({
			method: 'DELETE',
			path: `/1.0/instances/${this.name}${this.project ? `?project=${this.project}` : ''}`
		}) as Promise<LxdInstanceDeleteResponse>;
	}

	async put(data: LxdInstancePutRequest, project?: string): Promise<LxdBaseResponse<void>> {
		return this.client.request({
			method: 'PUT',
			path: `/1.0/instances/${this.name}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
			body: data
		}) as Promise<LxdBaseResponse<void>>;
	}

	async patch(data: LxdInstancePutRequest, project?: string): Promise<LxdBaseResponse<void>> {
		return this.client.request({
			method: 'PATCH',
			path: `/1.0/instances/${this.name}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
			body: data
		}) as Promise<LxdBaseResponse<void>>;
	}

	async post(data: LxdInstancePost, project?: string): Promise<LxdBaseResponse<void>> {
		return this.client.request({
			method: 'POST',
			path: `/1.0/instances/${this.name}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
			body: data
		}) as Promise<LxdBaseResponse<void>>;
	}

	async rebuild(data: LxdInstanceRebuildPost, project?: string): Promise<LxdBaseResponse<void>> {
		return this.client.request({
			method: 'POST',
			path: `/1.0/instances/${this.name}/rebuild${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
			body: data
		}) as Promise<LxdBaseResponse<void>>;
	}

	console = {
		get: async () => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/console${this.project ? `?project=${this.project}` : ''}`
			});
		},

		post: async (data: {
			height: number;
			width: number;
			type: 'console' | string;
		}): Promise<LxdInstanceConsoleResponse> => {
			return this.client.request({
				method: 'POST',
				path: `/1.0/instances/${this.name}/console${this.project ? `?project=${this.project}` : ''}`,
				body: data
			}) as Promise<LxdInstanceConsoleResponse>;
		}
	};

	exec = async (data: LxdInstanceExecRequest): Promise<LxdInstanceExecResponse> => {
		return this.client.request({
			method: 'POST',
			path: `/1.0/instances/${this.name}/exec${this.project ? `?project=${this.project}` : ''}`,
			body: data
		}) as Promise<LxdInstanceExecResponse>;
	};

	logs = {
		get: async () => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/logs${this.project ? `?project=${this.project}` : ''}`
			});
		},
		file: (filename: string) => ({
			get: async () => {
				return this.client.request({
					path: `/1.0/instances/${this.name}/logs/${filename}${this.project ? `?project=${this.project}` : ''}`
				});
			},
			delete: async () => {
				return this.client.request({
					method: 'DELETE',
					path: `/1.0/instances/${this.name}/logs/${filename}${this.project ? `?project=${this.project}` : ''}`
				});
			}
		}),
		execOutput: {
			get: async () => {
				return this.client.request({
					path: `/1.0/instances/${this.name}/logs/exec-output${this.project ? `?project=${this.project}` : ''}`
				});
			}
		}
	};

	state = {
		get: async (project?: string): Promise<LxdInstanceStateResponse> => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/state${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
			}) as Promise<LxdInstanceStateResponse>;
		},

		put: async (data: LxdInstanceStatePut, project?: string): Promise<LxdBaseResponse<void>> => {
			return this.client.request({
				method: 'PUT',
				path: `/1.0/instances/${this.name}/state${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
				body: data
			}) as Promise<LxdBaseResponse<void>>;
		}
	};

	files = {
		file: (path: string) => ({
			get: async () => {
				const file = await this.client.requestRaw({
					path: `/1.0/instances/${this.name}/files?path=${path}${this.project ? `&project=${this.project}` : ''}`
				});
				return {
					headers: file.headers,
					body: file.body as LxdBaseResponse<string[]> | any
				};
			},
			delete: async () => {
				return this.client.request({
					method: 'DELETE',
					path: `/1.0/instances/${this.name}/files?path=${path}${this.project ? `&project=${this.project}` : ''}`
				});
			},
			head: async () => {
				const file = await this.client.requestRaw({
					method: 'HEAD',
					path: `/1.0/instances/${this.name}/files?path=${path}${this.project ? `&project=${this.project}` : ''}`
				});
				return {
					headers: file.headers,
					body: file.body as LxdBaseResponse<string[]> | any
				};
			},
			post: async (
				body: any,
				headers?: {
					'X-LXD-uid': number;
					'X-LXD-gid': number;
					'X-LXD-mode': number;
					'X-LXD-type': string | 'file' | 'symlink' | 'directory';
					'X-LXD-modify-perm': string;
					'X-LXD-write': 'overwrite' | 'append';
				}
			) => {
				return this.client.request({
					method: 'POST',
					path: `/1.0/instances/${this.name}/files?path=${path}${this.project ? `&project=${this.project}` : ''}`,
					headers,
					body
				});
			}
		})
	};

	snapshots = {
		list: async (project?: string): Promise<LxdInstanceSnapshotsResponse> => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/snapshots${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
			}) as Promise<LxdInstanceSnapshotsResponse>;
		},

		get: async (snapshotName: string, project?: string): Promise<LxdInstanceSnapshotResponse> => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/snapshots/${snapshotName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
			}) as Promise<LxdInstanceSnapshotResponse>;
		},

		post: async (
			data: LxdInstanceSnapshotsPost,
			project?: string
		): Promise<LxdBaseResponse<void>> => {
			return this.client.request({
				method: 'POST',
				path: `/1.0/instances/${this.name}/snapshots${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
				body: data
			}) as Promise<LxdBaseResponse<void>>;
		},

		snapshot: (snapshotName: string) => ({
			put: async (
				data: LxdInstanceSnapshotPut,
				project?: string
			): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'PUT',
					path: `/1.0/instances/${this.name}/snapshots/${snapshotName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
					body: data
				}) as Promise<LxdBaseResponse<void>>;
			},

			patch: async (
				data: LxdInstanceSnapshotPut,
				project?: string
			): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'PATCH',
					path: `/1.0/instances/${this.name}/snapshots/${snapshotName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
					body: data
				}) as Promise<LxdBaseResponse<void>>;
			},

			delete: async (project?: string): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'DELETE',
					path: `/1.0/instances/${this.name}/snapshots/${snapshotName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
				}) as Promise<LxdBaseResponse<void>>;
			},

			post: async (
				data: LxdInstanceSnapshotPost,
				project?: string
			): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'POST',
					path: `/1.0/instances/${this.name}/snapshots/${snapshotName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
					body: data
				}) as Promise<LxdBaseResponse<void>>;
			}
		})
	};

	backups = {
		list: async (project?: string): Promise<LxdInstanceBackupsResponse> => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/backups${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
			}) as Promise<LxdInstanceBackupsResponse>;
		},

		get: async (backupName: string, project?: string): Promise<LxdInstanceBackupResponse> => {
			return this.client.request({
				path: `/1.0/instances/${this.name}/backups/${backupName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
			}) as Promise<LxdInstanceBackupResponse>;
		},

		post: async (
			data: LxdInstanceBackupsPost,
			project?: string
		): Promise<LxdBaseResponse<void>> => {
			return this.client.request({
				method: 'POST',
				path: `/1.0/instances/${this.name}/backups${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
				body: data
			}) as Promise<LxdBaseResponse<void>>;
		},

		backup: (backupName: string) => ({
			delete: async (project?: string): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'DELETE',
					path: `/1.0/instances/${this.name}/backups/${backupName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
				}) as Promise<LxdBaseResponse<void>>;
			},

			post: async (
				data: LxdInstanceBackupPost,
				project?: string
			): Promise<LxdBaseResponse<void>> => {
				return this.client.request({
					method: 'POST',
					path: `/1.0/instances/${this.name}/backups/${backupName}${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
					body: data
				}) as Promise<LxdBaseResponse<void>>;
			},

			export: async (project?: string) => {
				return this.client.requestRaw({
					method: 'GET',
					path: `/1.0/instances/${this.name}/backups/${backupName}/export${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`
				});
			}
		})
	};

	metaData = {
		get: async () => {
			const meta = await this.client.request({
				method: 'GET',
				path: `/1.0/instances/${this.name}/metadata${this.project ? `?project=${this.project}` : ''}`
			});
			return meta as LxdBaseResponse<unknown>;
		},

		put: async (
			data: Record<string, unknown>,
			project?: string
		): Promise<LxdBaseResponse<void>> => {
			return this.client.request({
				method: 'PUT',
				path: `/1.0/instances/${this.name}/metadata${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
				body: data
			}) as Promise<LxdBaseResponse<void>>;
		},

		patch: async (
			data: Record<string, unknown>,
			project?: string
		): Promise<LxdBaseResponse<void>> => {
			return this.client.request({
				method: 'PATCH',
				path: `/1.0/instances/${this.name}/metadata${(project ?? this.project) ? `?project=${project ?? this.project}` : ''}`,
				body: data
			}) as Promise<LxdBaseResponse<void>>;
		}
	};

	sftp: Record<string, any> = {
		connect: async (): Promise<{ sessionId: number }> => {
			return nextConnect({
				address: this.client.url.host,
				cert: this.client.clientInfo.cert,
				key: this.client.clientInfo.key,
				instance: this.name,
				insecure: this.client.clientInfo.allowInsecure
			}) as { sessionId: number };
		},

		session: (sessionId: number): Record<string, any> => ({
			disconnect: async () => {
				return nextDisconnect({ sessionId });
			},

			readDir: async (path: string) => {
				return nextReadDir({ sessionId, path });
			},

			stat: async (path: string) => {
				return nextStat({ sessionId, path });
			},

			lStat: async (path: string) => {
				return nextLstat({ sessionId, path });
			},

			readLink: async (path: string) => {
				return nextReadLink({ sessionId, path });
			},

			realPath: async (path: string) => {
				return nextRealPath({ sessionId, path });
			},

			getWd: async () => {
				return nextGetwd({ sessionId });
			},

			glob: async (pattern: string) => {
				return nextGlob({ sessionId, pattern });
			},

			open: async (path: string) => {
				const result = (await nextOpen({
					sessionId,
					path
				})) as { fileId: number };
				const fileId = result.fileId;

				return {
					fileId,

					read: async (length?: number): Promise<Buffer> => {
						const result = (await nextRead({
							fileId,
							length
						})) as { data: string };

						return Buffer.from(result.data, 'base64');
					},

					write: async (data: Buffer | Uint8Array | string) => {
						return nextWrite({
							fileId,
							data: Buffer.isBuffer(data)
								? data.toString('base64')
								: Buffer.from(data).toString('base64')
						});
					},

					close: async () => {
						return nextCloseFile({ fileId });
					}
				};
			},

			openFile: async (path: string, flags?: number) => {
				const result = (await nextOpenFile({
					sessionId,
					path,
					flags
				})) as { fileId: number };
				const fileId = result.fileId;

				return {
					fileId,

					read: async (length?: number): Promise<Buffer> => {
						const result = (await nextRead({
							fileId,
							length
						})) as { data: string };

						return Buffer.from(result.data, 'base64');
					},

					write: async (data: Buffer | Uint8Array | string) => {
						return nextWrite({
							fileId,
							data: Buffer.isBuffer(data)
								? data.toString('base64')
								: Buffer.from(data).toString('base64')
						});
					},

					close: async () => {
						return nextCloseFile({ fileId });
					}
				};
			},

			create: async (path: string) => {
				const result = (await nextCreate({
					sessionId,
					path
				})) as { fileId: number };
				const fileId = result.fileId;

				return {
					fileId,

					read: async (length?: number): Promise<Buffer> => {
						const result = (await nextRead({
							fileId,
							length
						})) as { data: string };

						return Buffer.from(result.data, 'base64');
					},

					write: async (data: Buffer | Uint8Array | string) => {
						return nextWrite({
							fileId,
							data: Buffer.isBuffer(data)
								? data.toString('base64')
								: Buffer.from(data).toString('base64')
						});
					},

					close: async () => {
						return nextCloseFile({ fileId });
					}
				};
			},

			closeFile: async (fileId: number) => {
				return nextCloseFile({ fileId });
			},

			remove: async (path: string) => {
				return nextRemove({
					sessionId,
					path
				});
			},

			removeDir: async (path: string) => {
				return nextRemoveDir({
					sessionId,
					path
				});
			},

			rename: async (oldPath: string, newPath: string) => {
				return nextRename({
					sessionId,
					oldPath,
					newPath
				});
			},

			posixRename: async (oldPath: string, newPath: string) => {
				return nextPosixRename({
					sessionId,
					oldPath,
					newPath
				});
			},

			mkdir: async (path: string) => {
				return nextMkdir({
					sessionId,
					path
				});
			},

			mkdirAll: async (path: string) => {
				return nextMkdirAll({
					sessionId,
					path
				});
			},

			chmod: async (path: string, mode: number) => {
				return nextChmod({
					sessionId,
					path,
					mode
				});
			},

			chown: async (path: string, uid: number, gid: number) => {
				return nextChown({
					sessionId,
					path,
					uid,
					gid
				});
			},

			chtimes: async (path: string, atime: Date | number, mtime: Date | number) => {
				return nextChtimes({
					sessionId,
					path,
					atime: typeof atime === 'object' ? atime.toISOString() : String(atime),
					mtime: typeof mtime === 'object' ? mtime.toISOString() : String(mtime)
				});
			}
		})
	};
}
