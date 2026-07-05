# next-lxd

**Production-grade LXD client for Node.js** — wraps the LXD REST API (`/1.0`) with a typed, class-based interface, plus native SFTP support via `next-lxd-sftp`.

> **Status:** v1.0.1 — MIT

---

## Installation

```bash
npm install next-lxd
```

Requires Node.js 18+ (ES2022).

### Dependencies

| Package | Purpose |
|---|---|
| `next-lxd-sftp` | Native Node-API addon for SFTP file operations |
| `undici` | HTTP client (used internally) |

---

## Quick Start

```typescript
import { Client } from 'next-lxd';

const client = new Client({
  url: 'https://10.0.0.1:8443',
  cert: fs.readFileSync('client.crt'),
  key: fs.readFileSync('client.key'),
  allowInsecure: true,
});

// Test the connection
const server = await client.connectionTest();
console.log(server.metadata.server_version);

// Access resource collections via client properties
const instances = client.instances;
const images = client.images;
const networks = client.networks;
const profiles = client.profiles;
const projects = client.projects;
const storagePools = client.storagePools;
const certificates = client.certificates;
const operations = client.operations;
const cluster = client.cluster;
const warnings = client.warnings;
```

---

## Architecture

The package follows a two-level pattern:

- **Collection classes** (`Instances`, `Images`, `Networks`, etc.) — list resources, fetch individual resources by name, and create new resources (POST).
- **Resource classes** (`Instance`, `Image`, `Network`, etc.) — represent a single LXD resource and expose its CRUD operations and sub-resources.

All classes extend the abstract `Resource` base class, which holds a reference to the `Client`.

---

## API Reference

### `Client`

The entry point. Creates an HTTPS agent with mutual TLS authentication and exposes all LXD resource collections.

```typescript
import { Client, ClientOptions, RequestOptions, RawResponse } from 'next-lxd';
```

#### Constructor

```typescript
new Client(options: ClientOptions)
```

| Option | Type | Description |
|---|---|---|
| `url` | `string` | LXD server URL (e.g. `https://10.0.0.1:8443`) |
| `cert` | `string \| Buffer` | TLS client certificate |
| `key` | `string \| Buffer` | TLS client private key |
| `ca` | `string \| Buffer` (optional) | Custom CA certificate |
| `password` | `string` (optional) | Trust password (for `POST /1.0/certificates`) |
| `allowInsecure` | `boolean` (optional) | Skip TLS verification (`rejectUnauthorized: false`) |

#### Properties

| Property | Type | Description |
|---|---|---|
| `url` | `URL` | Parsed server URL |
| `clientInfo` | `object` | Certificate/key metadata (read-only mirror) |

#### Methods

| Method | Description |
|---|---|
| `request<T>(options)` | Performs an HTTPS request and returns the parsed JSON body of type `T` |
| `requestRaw<T>(options)` | Performs an HTTPS request and returns `RawResponse<T>` (status, headers, body) |
| `connectionTest()` | GET `/1.0` — returns `LxdServerResponse` with server info |

#### `request` / `requestRaw` Options

```typescript
{
  method?: string;     // default 'GET'
  path: string;        // e.g. '/1.0/instances'
  headers?: Record<string, any>;
  body?: unknown;      // serialized as JSON
}
```

#### Collections (auto-instantiated)

Each collection is a public readonly property on the `Client` instance:

| Property | Class |
|---|---|
| `client.instances` | `Instances` |
| `client.images` | `Images` |
| `client.networks` | `Networks` |
| `client.profiles` | `Profiles` |
| `client.projects` | `Projects` |
| `client.storagePools` | `StoragePools` |
| `client.certificates` | `Certificates` |
| `client.operations` | `Operations` |
| `client.cluster` | `Cluster` |
| `client.warnings` | `Warnings` |

---

### `Instances`

Collection class — access via `client.instances`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/instances?project=...` |
| `get(name, project?)` | GET | `/1.0/instances/{name}` → returns `Instance` |
| `post(config, project?, target?)` | POST | `/1.0/instances` — creates an instance and returns the `Instance` object |

---

### `Instance`

Represents a single instance. Returned by `Instances.get()` / `Instances.post()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` |
| `status` | `string` |
| `metadata` | `LxdInstanceResponse['metadata']` |
| `project` | `string \| undefined` |

#### Methods (direct CRUD)

| Method | HTTP | Path |
|---|---|---|
| `delete()` | DELETE | `/1.0/instances/{name}` |
| `put(data, project?)` | PUT | `/1.0/instances/{name}` — full replace |
| `patch(data, project?)` | PATCH | `/1.0/instances/{name}` — partial update |
| `post(data, project?)` | POST | `/1.0/instances/{name}` — rename/migrate |
| `rebuild(data, project?)` | POST | `/1.0/instances/{name}/rebuild` |

#### Nested sub-resources

##### `instance.console`

| Method | HTTP | Path |
|---|---|---|
| `get()` | GET | `/1.0/instances/{name}/console` |
| `post({height, width, type})` | POST | `/1.0/instances/{name}/console` |

##### `instance.exec(data)` — single method

| Method | HTTP | Path |
|---|---|---|
| `exec(data)` | POST | `/1.0/instances/{name}/exec` |

See `LxdInstanceExecRequest` for the request shape (command, environment, interactive, etc.).

##### `instance.logs`

| Method | HTTP | Path |
|---|---|---|
| `get()` | GET | `/1.0/instances/{name}/logs` — list log files |
| `file(filename).get()` | GET | `/1.0/instances/{name}/logs/{filename}` |
| `file(filename).delete()` | DELETE | `/1.0/instances/{name}/logs/{filename}` |
| `execOutput.get()` | GET | `/1.0/instances/{name}/logs/exec-output` |

##### `instance.state`

| Method | HTTP | Path |
|---|---|---|
| `get(project?)` | GET | `/1.0/instances/{name}/state` — CPU, memory, network, processes |
| `put(data, project?)` | PUT | `/1.0/instances/{name}/state` — start/stop/restart/freeze |

##### `instance.files`

| Method | HTTP | Path | Notes |
|---|---|---|---|
| `file(path).get()` | GET | `/1.0/instances/{name}/files?path=...` | Returns headers + body |
| `file(path).delete()` | DELETE | `/1.0/instances/{name}/files?path=...` | |
| `file(path).head()` | HEAD | `/1.0/instances/{name}/files?path=...` | Returns headers only |
| `file(path).post(body, headers?)` | POST | `/1.0/instances/{name}/files?path=...` | Upload. Headers: `X-LXD-uid`, `X-LXD-gid`, `X-LXD-mode`, `X-LXD-type`, `X-LXD-write` |

##### `instance.snapshots`

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/instances/{name}/snapshots` |
| `get(snapshotName, project?)` | GET | `/1.0/instances/{name}/snapshots/{snapshot}` |
| `post(data, project?)` | POST | `/1.0/instances/{name}/snapshots` — create snapshot |
| `snapshot(name).put(data, project?)` | PUT | full update |
| `snapshot(name).patch(data, project?)` | PATCH | partial update |
| `snapshot(name).delete(project?)` | DELETE | |
| `snapshot(name).post(data, project?)` | POST | rename/restore |

##### `instance.backups`

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/instances/{name}/backups` |
| `get(backupName, project?)` | GET | `/1.0/instances/{name}/backups/{backup}` |
| `post(data, project?)` | POST | `/1.0/instances/{name}/backups` — create backup |
| `backup(name).delete(project?)` | DELETE | |
| `backup(name).post(data, project?)` | POST | rename |
| `backup(name).export(project?)` | GET raw | download backup as raw response |

##### `instance.metaData`

| Method | HTTP | Path |
|---|---|---|
| `get()` | GET | `/1.0/instances/{name}/metadata` |
| `put(data, project?)` | PUT | |
| `patch(data, project?)` | PATCH | |

---

#### SFTP (native addon)

The `instance.sftp` namespace provides secure file transfer directly into the instance's filesystem via the `next-lxd-sftp` native addon.

> **Note:** The native addon (`next-lxd-sftp`) must be installed and built for your platform.

```typescript
// 1. Connect — returns a sessionId
const { sessionId } = await instance.sftp.connect();

// 2. Use the session
const session = instance.sftp.session(sessionId);

// Directory operations
const entries = await session.readDir('/root');
await session.mkdir('/root/mydir');
await session.mkdirAll('/root/a/b/c');
await session.removeDir('/root/olddir');

// File operations
const file = await session.open('/root/file.txt');  // or openFile / create
await file.write(Buffer.from('hello'));
const data: Buffer = await file.read(1024);
await file.close();

// Stat / metadata
const stat = await session.stat('/root/file.txt');
await session.chmod('/root/file.txt', 0o755);
await session.chown('/root/file.txt', 1000, 1000);
await session.chtimes('/root/file.txt', new Date(), new Date());

// Path utilities
const real = await session.realPath('/root/../root');
const link = await session.readLink('/root/symlink');
const wd = await session.getWd();
const matches = await session.glob('*.txt');

// Remove / rename
await session.remove('/root/trash.txt');
await session.rename('/root/a.txt', '/root/b.txt');
await session.posixRename('/root/a.txt', '/root/b.txt');

// 3. Disconnect when done
await session.disconnect();
```

**Available session methods:**

| Method | Description |
|---|---|
| `disconnect()` | Close the SFTP session |
| `readDir(path)` | List directory entries |
| `stat(path)` | Get file/dir attributes |
| `lStat(path)` | Get attributes (no follow symlink) |
| `readLink(path)` | Read symlink target |
| `realPath(path)` | Resolve to absolute path |
| `getWd()` | Get working directory |
| `glob(pattern)` | Glob pattern matching |
| `open(path)` | Open file for read/write |
| `openFile(path, flags?)` | Open file with flags |
| `create(path)` | Create new file |
| `closeFile(fileId)` | Close file handle |
| `remove(path)` | Delete file |
| `removeDir(path)` | Delete empty directory |
| `rename(oldPath, newPath)` | Rename file/dir |
| `posixRename(oldPath, newPath)` | POSIX rename (overwrite if exists) |
| `mkdir(path)` | Create directory |
| `mkdirAll(path)` | Create directory (parents too) |
| `chmod(path, mode)` | Change permissions |
| `chown(path, uid, gid)` | Change owner/group |
| `chtimes(path, atime, mtime)` | Change access/modify times |

**File handle methods** (returned by `open`, `openFile`, `create`):

| Method | Description |
|---|---|
| `read(length?)` | Read up to `length` bytes → `Buffer` |
| `write(data)` | Write `Buffer`, `Uint8Array`, or `string` |
| `close()` | Close the file handle |

---

### `Images`

Collection class — access via `client.images`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/images?project=...` |
| `get(fingerprint, project?)` | GET | `/1.0/images/{fingerprint}` → returns `Image` |
| `post(config, project?)` | POST | `/1.0/images` — create (returns `LxdBaseResponse`) |

---

### `Image`

Represents a single image. Returned by `Images.get()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` (fingerprint) |
| `metadata` | `LxdImageResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete()` | DELETE | `/1.0/images/{fingerprint}` |
| `put(data)` | PUT | `/1.0/images/{fingerprint}` — full replace |
| `patch(data)` | PATCH | `/1.0/images/{fingerprint}` — partial update |
| `refresh()` | POST | `/1.0/images/{fingerprint}/refresh` |
| `export()` | GET raw | `/1.0/images/{fingerprint}/export` — download as raw response |
| `secret()` | POST | `/1.0/images/{fingerprint}/secret` — returns a secret for public download |

#### `image.aliases`

| Method | HTTP | Path |
|---|---|---|
| `list()` | GET | `/1.0/images/{fingerprint}/aliases` |
| `create(data)` | POST | `/1.0/images/{fingerprint}/aliases` |
| `entry(name).get()` | GET | `/1.0/images/aliases/{name}` |
| `entry(name).put(data)` | PUT | |
| `entry(name).patch(data)` | PATCH | |
| `entry(name).delete()` | DELETE | |

---

### `Networks`

Collection class — access via `client.networks`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/networks?project=...` |
| `get(name, project?)` | GET | `/1.0/networks/{name}` → returns `Network` |
| `post(config, project?)` | POST | `/1.0/networks` — create and return `Network` |

---

### `Network`

Represents a single network. Returned by `Networks.get()` / `Networks.post()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` |
| `type` | `string` |
| `managed` | `boolean` |
| `metadata` | `LxdNetworkResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete(project?)` | DELETE | `/1.0/networks/{name}` |
| `put(data, project?)` | PUT | full replace |
| `patch(data, project?)` | PATCH | partial update |
| `state(project?)` | GET | `/1.0/networks/{name}/state` |
| `leases(project?)` | GET | `/1.0/networks/{name}/leases` |

#### Sub-resources

**`network.forwards`** — network address forwards:

`list()`, `get(listenAddress)`, `post(data)`, `put(listenAddress, data)`, `delete(listenAddress)`

**`network.acls`** — network ACLs:

`list()`, `get(aclName)`, `post(data)`, `put(aclName, data)`, `delete(aclName)`

**`network.peers`** — network peers:

`list()`, `get(peerName)`, `put(peerName, data)`, `delete(peerName)`

---

### `Profiles`

Collection class — access via `client.profiles`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/profiles?project=...` |
| `get(name, project?)` | GET | `/1.0/profiles/{name}` → returns `Profile` |
| `post(config, project?)` | POST | `/1.0/profiles` — create and return `Profile` |

---

### `Profile`

Represents a single profile. Returned by `Profiles.get()` / `Profiles.post()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` |
| `description` | `string` |
| `metadata` | `LxdProfileResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete(project?)` | DELETE | `/1.0/profiles/{name}` |
| `put(data, project?)` | PUT | full replace |
| `patch(data, project?)` | PATCH | partial update |
| `post(data, project?)` | POST | rename |

---

### `Projects`

Collection class — access via `client.projects`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/projects?project=...` |
| `get(name, project?)` | GET | `/1.0/projects/{name}` → returns `Project` |
| `post(config, project?)` | POST | `/1.0/projects` — create and return `Project` |

---

### `Project`

Represents a single project. Returned by `Projects.get()` / `Projects.post()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` |
| `description` | `string` |
| `metadata` | `LxdProjectResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete(force?)` | DELETE | `/1.0/projects/{name}?force=1` |
| `put(data)` | PUT | full replace |
| `patch(data)` | PATCH | partial update |
| `post(data)` | POST | rename |
| `state()` | GET | `/1.0/projects/{name}/state` — resource usage |

---

### `StoragePools`

Collection class — access via `client.storagePools`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/storage-pools?project=...` |
| `get(name, project?)` | GET | `/1.0/storage-pools/{name}` → returns `StoragePool` |
| `post(config, project?)` | POST | `/1.0/storage-pools` — create and return `StoragePool` |

---

### `StoragePool`

Represents a single storage pool. Returned by `StoragePools.get()` / `StoragePools.post()`.

#### Properties

| Property | Type |
|---|---|
| `name` | `string` |
| `driver` | `string` |
| `metadata` | `LxdStoragePoolResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete()` | DELETE | `/1.0/storage-pools/{name}` |
| `put(data)` | PUT | full replace |
| `patch(data)` | PATCH | partial update |
| `resources()` | GET | `/1.0/storage-pools/{name}/resources` |

#### Sub-resources: `storagePool.volumes`

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/storage-pools/{name}/volumes` |
| `get(type, name, project?)` | GET | `/1.0/storage-pools/{name}/volumes/{type}/{name}` |
| `post(type, data, project?)` | POST | create volume |
| `put(type, name, data, project?)` | PUT | update volume |
| `patch(type, name, data, project?)` | PATCH | partial update volume |
| `delete(type, name, project?)` | DELETE | |
| `rename(type, name, data, project?)` | POST | rename volume |

**`storagePool.volumes.snapshots`** — volume snapshot operations:

`list(type, volumeName)`, `get(type, volumeName, snapshotName)`, `post(type, volumeName, data)`, `put(type, volumeName, snapshotName, data)`, `delete(type, volumeName, snapshotName)`, `rename(type, volumeName, snapshotName, data)`

---

### `Certificates`

Collection class — access via `client.certificates`.

| Method | HTTP | Path |
|---|---|---|
| `list()` | GET | `/1.0/certificates` |
| `get(fingerprint)` | GET | `/1.0/certificates/{fingerprint}` → returns `Certificate` |
| `post(config)` | POST | `/1.0/certificates` — add certificate |

---

### `Certificate`

Represents a single certificate. Returned by `Certificates.get()`.

| Property | Type |
|---|---|
| `fingerprint` | `string` |
| `metadata` | `LxdCertificateResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `delete()` | DELETE | `/1.0/certificates/{fingerprint}` |
| `put(data)` | PUT | full replace |
| `patch(data)` | PATCH | partial update |

---

### `Operations`

Collection class — access via `client.operations`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/operations?project=...` |
| `get(id)` | GET | `/1.0/operations/{id}` → returns `Operation` |

---

### `Operation`

Represents a single operation. Returned by `Operations.get()`.

| Property | Type |
|---|---|
| `id` | `string` |
| `metadata` | `LxdOperationResponse['metadata']` |

#### Methods

| Method | HTTP | Path |
|---|---|---|
| `wait(timeout?)` | GET | `/1.0/operations/{id}/wait?timeout=...` — blocks until complete |
| `cancel()` | DELETE | `/1.0/operations/{id}` |
| `websocketUrl(secret?)` | — | Returns the WebSocket URL for this operation (optionally with `?secret=...`) |

---

### `Cluster`

Collection class — access via `client.cluster`.

| Method | HTTP | Path |
|---|---|---|
| `get()` | GET | `/1.0/cluster` |
| `put(data)` | PUT | `/1.0/cluster` — bootstrap/join |
| `updateCertificate(data)` | PUT | `/1.0/cluster/certificate` |

#### Sub-resources

**`cluster.members`:**

`list()`, `get(name)`, `put(name, data)`, `patch(name, data)`, `rename(name, data)`, `delete(name)`, `state(name)`, `evacuate(name, data?)`, `restore(name, data?)`, `joinToken(data)`

**`cluster.groups`:**

`list()`, `get(name)`, `post(data)`, `put(name, data)`, `patch(name, data)`, `rename(name, data)`, `delete(name)`

---

### `Warnings`

Collection class — access via `client.warnings`.

| Method | HTTP | Path |
|---|---|---|
| `list(project?)` | GET | `/1.0/warnings?project=...` |
| `get(uuid)` | GET | `/1.0/warnings/{uuid}` |
| `put(uuid, data)` | PUT | `/1.0/warnings/{uuid}` |
| `delete(uuid)` | DELETE | `/1.0/warnings/{uuid}` |

---

## Type Exports

Key types (import from `next-lxd`):

```typescript
// Base response wrapper
LxdBaseResponse<T>

// Server
LxdServerResponse, LxdServerMetadata, LxdEnvironment

// Instances
InstanceCreateRequest, LxdInstanceResponse, LxdInstanceStateResponse,
LxdInstanceStatePut, LxdInstanceExecRequest, LxdInstanceExecResponse,
LxdInstanceConsoleResponse, LxdInstancePost, LxdInstancePutRequest,
LxdInstanceRebuildPost, LxdInstanceDeleteResponse

// Instance snapshots
LxdInstanceSnapshotsResponse, LxdInstanceSnapshotResponse,
LxdInstanceSnapshotsPost, LxdInstanceSnapshotPut, LxdInstanceSnapshotPost

// Instance backups
LxdInstanceBackupsResponse, LxdInstanceBackupResponse,
LxdInstanceBackupsPost, LxdInstanceBackupPost

// Images
LxdImageResponse, LxdImagesResponse, LxdImagePut, LxdImagesPost,
LxdImageAliasesResponse, LxdImageAliasResponse,
LxdImageAliasesPost, LxdImageAliasesEntryPut

// Networks
LxdNetworkResponse, LxdNetworksResponse, LxdNetworkPut, LxdNetworksPost,
LxdNetworkLeasesResponse, LxdNetworkForwardsResponse, LxdNetworkForwardResponse,
LxdNetworkForwardsPost, LxdNetworkForwardPut,
LxdNetworkACLsResponse, LxdNetworkACLResponse, LxdNetworkACLsPost, LxdNetworkACLPut,
LxdNetworkPeersResponse, LxdNetworkPeerResponse, LxdNetworkPeerPut

// Profiles
LxdProfileResponse, LxdProfilesResponse, LxdProfilePut, LxdProfilesPost, LxdProfilePost

// Projects
LxdProjectResponse, LxdProjectsResponse, LxdProjectPut, LxdProjectsPost, LxdProjectPost,
LxdProjectStateResponse

// Storage pools
LxdStoragePoolResponse, LxdStoragePoolsResponse, LxdStoragePoolPut, LxdStoragePoolsPost,
LxdStorageVolumesResponse, LxdStorageVolumeResponse, LxdStorageVolumesPost,
LxdStorageVolumePut, LxdStorageVolumePost,
LxdStorageVolumeSnapshotsResponse, LxdStorageVolumeSnapshotResponse,
LxdStorageVolumeSnapshotsPost, LxdStorageVolumeSnapshotPut, LxdStorageVolumeSnapshotPost

// Certificates
LxdCertificateResponse, LxdCertificatesResponse, LxdCertificatePut, LxdCertificatesPost

// Operations
LxdOperationResponse, LxdOperationsResponse

// Cluster
LxdClusterResponse, LxdClusterPut, LxdClusterCertificatePut,
LxdClusterMembersResponse, LxdClusterMemberResponse,
LxdClusterMemberPut, LxdClusterMemberPost, LxdClusterMembersPost,
LxdClusterMemberStateResponse, LxdClusterMemberStatePost, LxdClusterMemberJoinToken,
LxdClusterGroupsResponse, LxdClusterGroupResponse,
LxdClusterGroupPut, LxdClusterGroupPost, LxdClusterGroupsPost

// Warnings
LxdWarningsResponse, LxdWarningResponse, LxdWarningPut

// Events
LxdEvent
```

---

## Examples

### List all instances with their state

```typescript
const client = new Client({ url, cert, key });
const instances = await client.instances.list();

for (const name of instances.metadata) {
  const instance = await client.instances.get(name);
  console.log(`${name}: ${instance.status}`);
}
```

### Create and start a container

```typescript
const instance = await client.instances.post({
  name: 'my-container',
  source: {
    type: 'image',
    alias: 'ubuntu/22.04'
  }
});

// Start it
await instance.state.put({ action: 'start' });
```

### Upload a file via SFTP

```typescript
const instance = await client.instances.get('my-container');

// Wait for it to be running
await instance.state.put({ action: 'start' });

// SFTP
const { sessionId } = await instance.sftp.connect();
const session = instance.sftp.session(sessionId);

const file = await session.create('/root/hello.txt');
await file.write(Buffer.from('Hello, LXD!'));
await file.close();
await session.disconnect();
```

---

## Development

```bash
# Install dependencies
bun install   # or npm install

# Build TypeScript
npm run build

# Clean build output
npm run clean
```
