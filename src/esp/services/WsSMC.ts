import { IConnection, IOptions } from "../../comms/connection";
import { ESPConnection } from "../comms/connection";

export interface ActivityRequest {
    ChatURL?: string;
    BannerContent?: string;
    BannerColor?: string;
    BannerSize?: string;
    BannerScroll?: string;
    BannerAction?: string;
    EnableChatURL?: boolean;
    FromSubmitBtn?: boolean;
    SortBy?: string;
    Descending?: boolean;
}

export interface TargetCluster {
    ClusterName: string;
    QueueName: string;
    QueueStatus: string;
    StatusDetails: string;
    Warning?: any;
    ClusterType: number;
    ClusterSize: number;
    ClusterStatus: number;
}

export interface ThorClusterList {
    TargetCluster: TargetCluster[];
}

export interface TargetCluster2 {
    ClusterName: string;
    QueueName: string;
    QueueStatus: string;
    StatusDetails: string;
    Warning?: any;
    ClusterType: number;
    ClusterSize: number;
    ClusterStatus: number;
}

export interface RoxieClusterList {
    TargetCluster: TargetCluster2[];
}

export interface TargetCluster3 {
    ClusterName: string;
    QueueName: string;
    QueueStatus: string;
    StatusDetails: string;
    Warning?: any;
    ClusterType: number;
    ClusterSize: number;
    ClusterStatus: number;
}

export interface HThorClusterList {
    TargetCluster: TargetCluster3[];
}

export interface ActiveWorkunit {
    Wuid: string;
    State: string;
    StateID: number;
    Owner: string;
    Jobname: string;
    Server: string;
    Instance: string;
    Priority: string;
    Extra?: any;
    GraphName?: any;
    Duration?: any;
    GID?: any;
    QueueName: string;
    MemoryBlocked?: any;
    IsPausing: boolean;
    Warning?: any;
    ClusterName: string;
    ClusterType: string;
    ClusterQueueName: string;
    TargetClusterName: string;
}

export interface Running {
    ActiveWorkunit: ActiveWorkunit[];
}

export interface ServerJobQueue {
    QueueName: string;
    ServerName: string;
    ServerType: string;
    QueueStatus: string;
    StatusDetails: string;
    NetworkAddress: string;
    Port?: number;
}

export interface ServerJobQueues {
    ServerJobQueue: ServerJobQueue[];
}

export interface ActivityResponse {
    Build: string;
    ThorClusterList: ThorClusterList;
    RoxieClusterList: RoxieClusterList;
    HThorClusterList: HThorClusterList;
    Running: Running;
    BannerContent: string;
    BannerColor: string;
    BannerSize: string;
    BannerScroll: string;
    ChatURL: string;
    ShowBanner: number;
    ShowChatURL: number;
    SortBy?: any;
    Descending: boolean;
    SuperUser: boolean;
    AccessRight: string;
    ServerJobQueues: ServerJobQueues;
}

export interface RootObject {
    ActivityResponse: ActivityResponse;
}

export class Service {
    private _connection: ESPConnection;

    constructor(optsConnection: IOptions | IConnection) {
        this._connection = new ESPConnection(optsConnection, "WsSMC", "1.19");
    }

    Activity(request: ActivityRequest): Promise<ActivityResponse> {
        return this._connection.send("Activity", request);
    }
}
