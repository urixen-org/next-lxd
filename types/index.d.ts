export interface LxdBaseResponse<T> {
	type: string;
	status: string;
	status_code: number;
	operation: string;
	error_code: number;
	error: string;
	metadata: T;
}

export type LxdServerResponse = LxdBaseResponse<LxdServerMetadata>;

export interface LxdServerMetadata {
	config: Record<string, string>;
	api_extensions: string[];
	api_status: string;
	api_version: string;
	auth: string;
	public: boolean;
	auth_methods: string[];
	auth_user_name: string;
	auth_user_method: string;
	environment: LxdEnvironment;
}

export interface LxdEnvironment {
	addresses: string[];
	architectures: string[];
	certificate: string;
	certificate_fingerprint: string;
	driver: string;
	driver_version: string;
	firewall: string;
	kernel: string;
	kernel_architecture: string;
	kernel_features: Record<string, unknown>;
	kernel_version: string;
	lxc_features: Record<string, unknown>;
	os_name: string;
	os_version: string;
	project: string;
	server: string;
	server_clustered: boolean;
	server_event_mode: string;
	server_name: string;
	server_pid: number;
	server_version: string;
	storage: string;
	storage_version: string;
	storage_supported_drivers: Record<string, unknown>[];
}

export type LxdInstancesResponse = LxdBaseResponse<string[]>;

export type LxdInstanceResponse = LxdBaseResponse<LxdInstance>;

export interface LxdInstance {
	architecture: string;
	config: Record<string, string>;
	devices: Record<string, Record<string, string>>;
	ephemeral: boolean;
	profiles: string[];
	stateful: boolean;
	description: string;
	created_at: string;
	expanded_config: Record<string, string>;
	expanded_devices: Record<string, Record<string, string>>;
	name: string;
	status: string;
	status_code: number;
	last_used_at: string;
	location: string;
	type: string;
	project: string;
}

export type LxdOperationResponse = LxdBaseResponse<LxdOperation>;

export interface LxdOperation {
	id: string;
	class: string;
	description: string;
	created_at: string;
	updated_at: string;
	status: string;
	status_code: number;
	resources: Record<string, string[]>;
	metadata: Record<string, any>;
	may_cancel: boolean;
	err: string;
	location: string;
}

export interface LxdInstanceCreateSource {
	type: 'image' | 'migration' | 'copy' | 'none';
	alias?: string;
	fingerprint?: string;
	server?: string;
	protocol?: string;
	certificate?: string;
	mode?: 'pull' | 'push';
	operation?: string;
	secrets?: Record<string, string>;
	base?: {
		fingerprint: string;
	};
}

export interface LxdInstanceCreateRequest {
	name: string;
	source: LxdInstanceCreateSource;
	architecture?: string;
	profiles?: string[];
	ephemeral?: boolean;
	config?: Record<string, string>;
	devices?: Record<string, Record<string, string>>;
	type?: 'container' | 'virtual-machine';
}

export interface LxdInstancePutRequest {
	architecture?: string;
	config?: Record<string, string>;
	devices?: Record<string, Record<string, string>>;
	ephemeral?: boolean;
	profiles?: string[];
	stateful?: boolean;
	description?: string;
}

export type LxdInstanceDeleteResponse = LxdBaseResponse<LxdInstanceDeleteMetadata>;

export interface LxdInstanceDeleteMetadata {
	class: string;
	created_at: string;
	description: string;
	err: string;
	id: string;
	location: string;
	may_cancel: boolean;
	metadata: {
		command: string[];
		environment: Record<string, any>;
	};
	requestor: {
		address: string;
		protocol: string;
		username: string;
	};
	resources: {
		containers: string[];
		instances: string[];
	};
	status: string;
	status_code: number;
	updated_at: string;
}

export type LxdInstanceConsoleResponse = LxdBaseResponse<LxdInstanceConsoleOperation>;

export interface LxdInstanceConsoleOperation {
	id: string;
	class: 'websocket';
	description: string;
	created_at: string;
	updated_at: string;
	status: string;
	status_code: number;
	resources: {
		containers?: string[];
		instances: string[];
	};
	metadata: LxdInstanceConsoleMetadata;
	may_cancel: boolean;
	err: string;
	location: string;
	requestor?: {
		address: string;
		protocol: string;
		username: string;
	};
}

export interface LxdInstanceConsoleMetadata {
	command?: string[];
	environment?: Record<string, string>;
	fds: Record<string, string>;
	interactive: boolean;
}

export interface LxdInstanceExecRequest {
	command: string[];
	cwd?: string;
	environment?: Record<string, string>;
	group?: number;
	height?: number;
	interactive?: boolean;
	'record-output'?: boolean;
	user?: number;
	'wait-for-websocket'?: boolean;
	width?: number;
}

export interface LxdInstanceExecResponse {
	type: 'async';
	status: string;
	status_code: number;
	operation: string;
	metadata: {
		id: string;
		class: 'websocket';
		description: string;
		status: string;
		status_code: number;
		metadata: {
			command: string[];
			environment: Record<string, string>;
			interactive: boolean;
			fds: Record<string, string>;
		};
	};
}

export interface InstanceCreateRequest {
  architecture?: string;
  config?: Record<string, string>;
  description?: string;
  devices?: Record<string, Device>;
  ephemeral?: boolean;
  instance_type?: string;
  name: string;
  profiles?: string[];
  restore?: string;
  source: Source;
  start?: boolean;
  stateful?: boolean;
  type?: string;
}

export interface Device {
  path?: string;
  pool?: string;
  type: string;
  [key: string]: unknown;
}

export interface Source {
  type: string;
  alias?: string;
  fingerprint?: string;
  server?: string;
  protocol?: string;
  mode?: string;
  certificate?: string;
  secret?: string;
  secrets?: Record<string, string>;
  operation?: string;
  project?: string;
  source?: string;
  properties?: Record<string, string>;
  conversion_options?: string[];
  source_disk_size?: number;
  allow_inconsistent?: boolean;
  container_only?: boolean;
  instance_only?: boolean;
  live?: boolean;
  refresh?: boolean;
  override_snapshot_profiles?: boolean;
  "base-image"?: string;
}

export interface LxdImage {
  access_entitlements?: string[];
  aliases?: LxdImageAlias[];
  architecture: string;
  auto_update: boolean;
  cached: boolean;
  created_at: string;
  expires_at: string;
  filename: string;
  fingerprint: string;
  last_used_at: string;
  profiles?: string[];
  project?: string;
  properties?: Record<string, string>;
  public: boolean;
  size: number;
  type?: string;
  update_source?: LxdImageSource;
  uploaded_at: string;
}

export interface LxdImageAlias {
  description?: string;
  name: string;
}

export interface LxdImagePut {
  auto_update?: boolean;
  expires_at?: string;
  profiles?: string[];
  properties?: Record<string, string>;
  public?: boolean;
}

export interface LxdImageSource {
  alias?: string;
  certificate?: string;
  image_type?: string;
  protocol?: string;
  server?: string;
}

export interface LxdImagesPostSource {
  alias?: string;
  certificate?: string;
  fingerprint?: string;
  image_type?: string;
  mode?: string;
  name?: string;
  project?: string;
  protocol?: string;
  secret?: string;
  server?: string;
  type?: string;
  url?: string;
}

export interface LxdImagesPost {
  aliases?: LxdImageAlias[];
  auto_update?: boolean;
  compression_algorithm?: string;
  expires_at?: string;
  filename?: string;
  profiles?: string[];
  properties?: Record<string, string>;
  public?: boolean;
  source?: LxdImagesPostSource;
}

export interface LxdImageAliasesEntry {
  access_entitlements?: string[];
  description?: string;
  name: string;
  target: string;
  type?: string;
}

export interface LxdImageAliasesEntryPut {
  description?: string;
  target?: string;
}

export interface LxdImageAliasesPost {
  access_entitlements?: string[];
  description?: string;
  name: string;
  target: string;
  type?: string;
}

export interface LxdImageAliasesEntryPost {
  name: string;
}

export interface LxdImageExportPost {
  aliases?: LxdImageAlias[];
  certificate?: string;
  profiles?: string[];
  project?: string;
  secret?: string;
  target?: string;
}

export interface LxdNetwork {
  access_entitlements?: string[];
  config?: Record<string, string>;
  description?: string;
  locations?: string[];
  managed: boolean;
  name: string;
  project?: string;
  status?: string;
  type: string;
  used_by?: string[];
}

export interface LxdNetworkPut {
  config?: Record<string, string>;
  description?: string;
}

export interface LxdNetworksPost {
  config?: Record<string, string>;
  description?: string;
  name: string;
  type: string;
}

export interface LxdNetworkACL {
  access_entitlements?: string[];
  config?: Record<string, string>;
  description?: string;
  egress?: LxdNetworkACLRule[];
  ingress?: LxdNetworkACLRule[];
  name: string;
  project?: string;
  used_by?: string[];
}

export interface LxdNetworkACLPut {
  config?: Record<string, string>;
  description?: string;
  egress?: LxdNetworkACLRule[];
  ingress?: LxdNetworkACLRule[];
}

export interface LxdNetworkACLsPost {
  config?: Record<string, string>;
  description?: string;
  egress?: LxdNetworkACLRule[];
  ingress?: LxdNetworkACLRule[];
  name: string;
}

export interface LxdNetworkACLRule {
  action: string;
  description?: string;
  destination?: string;
  destination_port?: string;
  icmp_code?: string;
  icmp_type?: string;
  protocol?: string;
  source?: string;
  source_port?: string;
  state?: string;
}

export interface LxdNetworkForward {
  config?: Record<string, string>;
  description?: string;
  listen_address: string;
  location?: string;
  ports?: LxdNetworkForwardPort[];
}

export interface LxdNetworkForwardPut {
  config?: Record<string, string>;
  description?: string;
  ports?: LxdNetworkForwardPort[];
}

export interface LxdNetworkForwardsPost {
  config?: Record<string, string>;
  description?: string;
  listen_address: string;
  ports?: LxdNetworkForwardPort[];
}

export interface LxdNetworkForwardPort {
  description?: string;
  listen_port?: string;
  protocol?: string;
  target_address?: string;
  target_port?: string;
}

export interface LxdNetworkLease {
  address?: string;
  hostname?: string;
  hwaddr?: string;
  location?: string;
  project?: string;
  type?: string;
}

export interface LxdNetworkLoadBalancer {
  backends?: LxdNetworkLoadBalancerBackend[];
  config?: Record<string, string>;
  description?: string;
  listen_address: string;
  location?: string;
  ports?: LxdNetworkLoadBalancerPort[];
}

export interface LxdNetworkLoadBalancerPut {
  backends?: LxdNetworkLoadBalancerBackend[];
  config?: Record<string, string>;
  description?: string;
  ports?: LxdNetworkLoadBalancerPort[];
}

export interface LxdNetworkLoadBalancersPost {
  backends?: LxdNetworkLoadBalancerBackend[];
  config?: Record<string, string>;
  description?: string;
  listen_address: string;
  ports?: LxdNetworkLoadBalancerPort[];
}

export interface LxdNetworkLoadBalancerBackend {
  description?: string;
  name?: string;
  target_address?: string;
  target_port?: string;
}

export interface LxdNetworkLoadBalancerPort {
  description?: string;
  listen_port?: string;
  protocol?: string;
  target_backend?: string[];
}

export interface LxdNetworkPeer {
  config?: Record<string, string>;
  description?: string;
  name: string;
  status?: string;
  target_network?: string;
  target_project?: string;
  used_by?: string[];
}

export interface LxdNetworkPeerPut {
  config?: Record<string, string>;
  description?: string;
}

export interface LxdNetworkAllocations {
  addresses?: string;
  hwaddr?: string;
  nat?: boolean;
  network?: string;
  type?: string;
  used_by?: string;
}

export interface LxdProfile {
  config?: Record<string, string>;
  description?: string;
  devices?: Record<string, Record<string, string>>;
  name: string;
  used_by?: string[];
}

export interface LxdProfilePut {
  config?: Record<string, string>;
  description?: string;
  devices?: Record<string, Record<string, string>>;
}

export interface LxdProfilesPost {
  config?: Record<string, string>;
  description?: string;
  devices?: Record<string, Record<string, string>>;
  name: string;
}

export interface LxdProfilePost {
  name: string;
}

export interface LxdProject {
  config?: Record<string, string>;
  description?: string;
  name: string;
  used_by?: string[];
}

export interface LxdProjectPut {
  config?: Record<string, string>;
  description?: string;
}

export interface LxdProjectsPost {
  config?: Record<string, string>;
  description?: string;
  name: string;
}

export interface LxdProjectPost {
  name: string;
}

export interface LxdProjectState {
  resources?: Record<string, { limit?: number; usage?: number }>;
}

export interface LxdStoragePool {
  config?: Record<string, string>;
  description?: string;
  driver: string;
  locations?: string[];
  name: string;
  source?: string;
  status?: string;
}

export interface LxdStoragePoolPut {
  config?: Record<string, string>;
  description?: string;
}

export interface LxdStoragePoolsPost {
  config?: Record<string, string>;
  description?: string;
  driver: string;
  name: string;
}

export interface LxdStorageVolume {
  access_entitlements?: string[];
  config?: Record<string, string>;
  content_type?: string;
  created_at?: string;
  description?: string;
  location?: string;
  name: string;
  pool?: string;
  project?: string;
  type: string;
  used_by?: string[];
}

export interface LxdStorageVolumePut {
  config?: Record<string, string>;
  description?: string;
  restore?: string;
}

export interface LxdStorageVolumesPost {
  config?: Record<string, string>;
  content_type?: string;
  description?: string;
  name: string;
  restore?: string;
  source?: LxdStorageVolumeSource;
  type: string;
}

export interface LxdStorageVolumePost {
  migration?: boolean;
  name?: string;
  pool?: string;
  project?: string;
  source?: LxdStorageVolumeSource;
  target?: Record<string, unknown>;
  volume_only?: boolean;
}

export interface LxdStorageVolumeSource {
  certificate?: string;
  location?: string;
  mode?: string;
  name?: string;
  operation?: string;
  pool?: string;
  project?: string;
  refresh?: boolean;
  secrets?: Record<string, string>;
  type?: string;
  volume_only?: boolean;
}

export interface LxdStorageVolumeSnapshot {
  config?: Record<string, string>;
  content_type?: string;
  created_at?: string;
  description?: string;
  expires_at?: string;
  name: string;
}

export interface LxdStorageVolumeSnapshotsPost {
  description?: string;
  expires_at?: string;
  name?: string;
}

export interface LxdStorageVolumeSnapshotPut {
  description?: string;
  expires_at?: string;
}

export interface LxdStorageVolumeSnapshotPost {
  migration?: boolean;
  name?: string;
  target?: Record<string, unknown>;
}

export interface LxdStorageVolumeState {
  usage?: { inodes_used?: number; space_used?: number };
}

export interface LxdCluster {
  enabled: boolean;
  member_config?: LxdClusterMemberConfigKey[];
  server_name?: string;
}

export interface LxdClusterPut {
  cluster_address?: string;
  cluster_certificate?: string;
  cluster_password?: string;
  cluster_token?: string;
  enabled?: boolean;
  member_config?: LxdClusterMemberConfigKey[];
  server_address?: string;
  server_name?: string;
}

export interface LxdClusterCertificatePut {
  cluster_certificate?: string;
  cluster_certificate_key?: string;
}

export interface LxdClusterMember {
  architecture?: string;
  config?: Record<string, string>;
  database?: boolean;
  description?: string;
  failure_domain?: string;
  groups?: string[];
  message?: string;
  roles?: string[];
  server_name: string;
  status: string;
  url?: string;
}

export interface LxdClusterMemberPut {
  config?: Record<string, string>;
  description?: string;
  failure_domain?: string;
  groups?: string[];
  roles?: string[];
}

export interface LxdClusterMemberPost {
  server_name: string;
}

export interface LxdClusterMembersPost {
  server_name: string;
}

export interface LxdClusterMemberConfigKey {
  description?: string;
  entity?: string;
  key?: string;
  name?: string;
  value?: string;
}

export interface LxdClusterMemberJoinToken {
  addresses?: string[];
  expires_at?: string;
  fingerprint?: string;
  secret?: string;
  server_name?: string;
}

export interface LxdClusterMemberState {
  storage_pools?: Record<string, unknown>;
  sysinfo?: {
    buffered_ram?: number;
    free_ram?: number;
    free_swap?: number;
    load_averages?: number[];
    logical_cpus?: number;
    processes?: number;
    shared_ram?: number;
    total_ram?: number;
    total_swap?: number;
    uptime?: number;
  };
}

export interface LxdClusterMemberStatePost {
  action?: string;
  mode?: string;
}

export interface LxdClusterGroup {
  description?: string;
  members?: string[];
  name: string;
  used_by?: string[];
}

export interface LxdClusterGroupPut {
  description?: string;
  members?: string[];
}

export interface LxdClusterGroupPost {
  name: string;
}

export interface LxdClusterGroupsPost {
  description?: string;
  members?: string[];
  name: string;
}

export interface LxdCertificate {
  certificate?: string;
  fingerprint: string;
  name?: string;
  projects?: string[];
  restricted?: boolean;
  type?: string;
}

export interface LxdCertificatePut {
  name?: string;
  projects?: string[];
  restricted?: boolean;
  type?: string;
}

export interface LxdCertificatesPost {
  certificate?: string;
  name?: string;
  password?: string;
  projects?: string[];
  restricted?: boolean;
  token?: boolean;
  trust_token?: string;
  type?: string;
}

export interface LxdCertificateAddToken {
  addresses?: string[];
  client_name?: string;
  expires_at?: string;
  fingerprint?: string;
  secret?: string;
  type?: string;
}

export interface LxdEvent {
  location?: string;
  metadata?: unknown;
  project?: string;
  timestamp?: string;
  type?: string;
}

export interface LxdWarning {
  count: number;
  entity_url?: string;
  first_seen_at?: string;
  last_message?: string;
  last_seen_at?: string;
  location?: string;
  project?: string;
  severity?: string;
  status: string;
  type?: string;
  uuid: string;
}

export interface LxdWarningPut {
  status: string;
}

export type LxdImagesResponse = LxdBaseResponse<string[]>;
export type LxdImageResponse = LxdBaseResponse<LxdImage>;
export type LxdImageAliasesResponse = LxdBaseResponse<string[]>;
export type LxdImageAliasResponse = LxdBaseResponse<LxdImageAliasesEntry>;

export type LxdNetworksResponse = LxdBaseResponse<string[]>;
export type LxdNetworkResponse = LxdBaseResponse<LxdNetwork>;
export type LxdNetworkACLsResponse = LxdBaseResponse<string[]>;
export type LxdNetworkACLResponse = LxdBaseResponse<LxdNetworkACL>;
export type LxdNetworkForwardsResponse = LxdBaseResponse<string[]>;
export type LxdNetworkForwardResponse = LxdBaseResponse<LxdNetworkForward>;
export type LxdNetworkLeasesResponse = LxdBaseResponse<LxdNetworkLease[]>;
export type LxdNetworkLoadBalancersResponse = LxdBaseResponse<string[]>;
export type LxdNetworkLoadBalancerResponse = LxdBaseResponse<LxdNetworkLoadBalancer>;
export type LxdNetworkPeersResponse = LxdBaseResponse<string[]>;
export type LxdNetworkPeerResponse = LxdBaseResponse<LxdNetworkPeer>;
export type LxdNetworkAllocationsResponse = LxdBaseResponse<LxdNetworkAllocations[]>;

export type LxdProfilesResponse = LxdBaseResponse<string[]>;
export type LxdProfileResponse = LxdBaseResponse<LxdProfile>;

export type LxdProjectsResponse = LxdBaseResponse<string[]>;
export type LxdProjectResponse = LxdBaseResponse<LxdProject>;
export type LxdProjectStateResponse = LxdBaseResponse<LxdProjectState>;

export type LxdStoragePoolsResponse = LxdBaseResponse<string[]>;
export type LxdStoragePoolResponse = LxdBaseResponse<LxdStoragePool>;
export type LxdStoragePoolResourcesResponse = LxdBaseResponse<{ space?: { total?: number; used?: number }; inodes?: { total?: number; used?: number } }>;
export type LxdStorageVolumesResponse = LxdBaseResponse<string[]>;
export type LxdStorageVolumeResponse = LxdBaseResponse<LxdStorageVolume>;
export type LxdStorageVolumeSnapshotsResponse = LxdBaseResponse<string[]>;
export type LxdStorageVolumeSnapshotResponse = LxdBaseResponse<LxdStorageVolumeSnapshot>;
export type LxdStorageVolumeStateResponse = LxdBaseResponse<LxdStorageVolumeState>;

export type LxdClusterResponse = LxdBaseResponse<LxdCluster>;
export type LxdClusterMembersResponse = LxdBaseResponse<string[]>;
export type LxdClusterMemberResponse = LxdBaseResponse<LxdClusterMember>;
export type LxdClusterMemberStateResponse = LxdBaseResponse<LxdClusterMemberState>;
export type LxdClusterGroupsResponse = LxdBaseResponse<string[]>;
export type LxdClusterGroupResponse = LxdBaseResponse<LxdClusterGroup>;

export type LxdCertificatesResponse = LxdBaseResponse<string[]>;
export type LxdCertificateResponse = LxdBaseResponse<LxdCertificate>;

export type LxdOperationsResponse = LxdBaseResponse<Record<string, string[]>>;

export type LxdWarningsResponse = LxdBaseResponse<string[]>;
export type LxdWarningResponse = LxdBaseResponse<LxdWarning>;

// Instance snapshot types
export type LxdInstanceSnapshotsResponse = LxdBaseResponse<string[]>;
export type LxdInstanceSnapshotResponse = LxdBaseResponse<LxdInstanceSnapshot>;

export interface LxdInstanceSnapshot {
  architecture?: string;
  config?: Record<string, string>;
  created_at: string;
  devices?: Record<string, Record<string, string>>;
  ephemeral?: boolean;
  expanded_config?: Record<string, string>;
  expanded_devices?: Record<string, Record<string, string>>;
  expires_at?: string;
  last_used_at?: string;
  name: string;
  profiles?: string[];
  size?: number;
  stateful?: boolean;
}

export interface LxdInstanceSnapshotsPost {
  expires_at?: string;
  name?: string;
  stateful?: boolean;
}

export interface LxdInstanceSnapshotPut {
  expires_at?: string;
}

export interface LxdInstanceSnapshotPost {
  live?: boolean;
  migration?: boolean;
  name?: string;
  target?: Record<string, unknown>;
}

// Instance backup types
export type LxdInstanceBackupsResponse = LxdBaseResponse<string[]>;
export type LxdInstanceBackupResponse = LxdBaseResponse<LxdInstanceBackup>;

export interface LxdInstanceBackup {
  container_only?: boolean;
  created_at?: string;
  expires_at?: string;
  instance_only?: boolean;
  name: string;
  optimized_storage?: boolean;
}

export interface LxdInstanceBackupsPost {
  compression_algorithm?: string;
  container_only?: boolean;
  expires_at?: string;
  instance_only?: boolean;
  name?: string;
  optimized_storage?: boolean;
}

export interface LxdInstanceBackupPost {
  name: string;
}

// Instance state types
export type LxdInstanceStateResponse = LxdBaseResponse<LxdInstanceState>;

export interface LxdInstanceCPU {
  usage?: number;
}

export interface LxdInstanceDisk {
  total?: number;
  usage?: number;
}

export interface LxdInstanceMemory {
  swap_usage?: number;
  swap_usage_peak?: number;
  total?: number;
  usage?: number;
  usage_peak?: number;
}

export interface LxdInstanceNetworkAddress {
  address?: string;
  family?: string;
  netmask?: string;
  scope?: string;
}

export interface LxdInstanceNetworkCounters {
  bytes_received?: number;
  bytes_sent?: number;
  errors_received?: number;
  errors_sent?: number;
  packets_dropped_inbound?: number;
  packets_dropped_outbound?: number;
  packets_received?: number;
  packets_sent?: number;
}

export interface LxdInstanceStateNetwork {
  addresses?: LxdInstanceNetworkAddress[];
  counters?: LxdInstanceNetworkCounters;
  host_name?: string;
  hwaddr?: string;
  mtu?: number;
  state?: string;
  type?: string;
}

export interface LxdInstanceState {
  cpu?: LxdInstanceCPU;
  disk?: Record<string, LxdInstanceDisk>;
  memory?: LxdInstanceMemory;
  network?: Record<string, LxdInstanceStateNetwork>;
  pid?: number;
  processes?: number;
  status?: string;
  status_code?: number;
}

export interface LxdInstanceStatePut {
  action: string;
  force?: boolean;
  stateful?: boolean;
  timeout?: number;
}

// Instance rename/migrate/rebuild types
export interface LxdInstancePost {
  name?: string;
  migration?: boolean;
  live?: boolean;
  instance_only?: boolean;
  container_only?: boolean;
  allow_inconsistent?: boolean;
  pool?: string;
  project?: string;
  target?: Record<string, unknown>;
  config?: Record<string, string>;
  devices?: Record<string, Record<string, string>>;
  profiles?: string[];
}

export interface LxdInstanceRebuildPost {
  source?: LxdInstanceSource;
}

export interface LxdInstanceSource {
  type: string;
  alias?: string;
  certificate?: string;
  fingerprint?: string;
  image_type?: string;
  mode?: string;
  name?: string;
  project?: string;
  protocol?: string;
  secret?: string;
  server?: string;
  source?: string;
  url?: string;
  live?: boolean;
  instance_only?: boolean;
  refresh?: boolean;
  secrets?: Record<string, string>;
  properties?: Record<string, string>;
  base_image?: string;
  allow_inconsistent?: boolean;
}
