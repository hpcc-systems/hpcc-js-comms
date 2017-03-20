import { IConnection, IOptions, ResponseType } from "../../comms/connection";
import { deepMixin } from "../../util/object";
import { xml2json, XMLNode } from "../../util/SAXParser";
import { ESPConnection } from "../comms/connection";

export enum WUStateID {
    Unknown = 0,
    Compiled,
    Running,
    Completed,
    Failed,
    Archived,
    Aborting,
    Aborted,
    Blocked,
    Submitted,
    Scheduled,
    Compiling,
    Wait,
    UploadingFiled,
    DebugPaused,
    DebugRunning,
    Paused,
    LAST,
    NotFound = 999
}

export enum WUAction {
    Unknown = 0,
    Compile,
    Check,
    Run,
    ExecuteExisting,
    Pause,
    PauseNow,
    Resume,
    Debug,
    __size
};

export interface Query {
    Text: string;
}

export interface ECLHelpFile {
    Name: string;
    Type: string;
    IPAddress: string;
    Description: string;
    FileSize: number;
    PID: number;
    minActivityId: number;
    maxActivityId: number;
}

export interface Helpers {
    ECLHelpFile: ECLHelpFile[];
}

export interface ECLSchemaItem {
    ColumnName: string;
    ColumnType: string;
    ColumnTypeCode: number;
    isConditional: boolean;
}

export interface ECLSchemas {
    ECLSchemaItem: ECLSchemaItem[];
}

export interface ECLResult {
    Name: string;
    Sequence: number;
    Value: string;
    Link: string;
    FileName: string;
    IsSupplied: boolean;
    ShowFileContent: boolean;
    Total: number;
    ECLSchemas: ECLSchemas;
}

export interface Results {
    ECLResult: ECLResult[];
}

export interface ECLTimer {
    Name: string;
    Value: string;
    count: number;
    GraphName: string;
    SubGraphId?: number;
}

export interface Timers {
    ECLTimer: ECLTimer[];
}

export interface DebugValue {
    Name: string;
    Value: string;
}

export interface DebugValues {
    DebugValue: DebugValue[];
}

export interface ApplicationValue {
    Application: string;
    Name: string;
    Value: string;
}

export interface ApplicationValues {
    ApplicationValue: ApplicationValue[];
}

export interface AllowedClusters {
    AllowedCluster: string[];
}

export interface ECLException {
    Source: string;
    Severity: string;
    Code: number;
    Message: string;
    FileName: string;
    LineNo: number;
    Column: number;
}

export interface Exceptions {
    ECLException: ECLException[];
}

export interface ECLWorkunit {
    Wuid: string;
    Owner: string;
    Cluster: string;
    Jobname: string;
    StateID: WUStateID;
    State: string;
    Protected: boolean;
    DateTimeScheduled: Date;
    IsPausing: boolean;
    ThorLCR: boolean;
    TotalClusterTime: string;
    ApplicationValues: ApplicationValues;
    HasArchiveQuery: boolean;
}

export function isECLWorkunit(_: ECLWorkunit | Workunit): _ is ECLWorkunit {
    return (<ECLWorkunit>_).TotalClusterTime !== undefined;
}

export interface ThorLogInfo {
    ProcessName: string;
    ClusterGroup: string;
    LogDate: string;
    NumberSlaves: number;
}

export interface ThorLogList {
    ThorLogInfo: ThorLogInfo[];
}

export interface ResourceURLs {
    URL: string[];
}

export interface Variables {
    ECLVariable: any[];
}

export interface ECLGraph {
    Name: string;
    Label: string;
    Type: string;
    Complete: boolean;
    WhenStarted: Date;
    WhenFinished: Date;
}

export interface Graphs {
    ECLGraph: ECLGraph[];
}

export interface Workunit extends ECLWorkunit {
    StateEx: string;
    ActionEx: string;
    Description: string;
    PriorityClass: number;
    PriorityLevel: number;
    Snapshot: string;
    ResultLimit: number;
    Archived: boolean;
    EventSchedule: number;
    HaveSubGraphTimings: boolean;
    Query: Query;
    Helpers: Helpers;
    Results: Results;
    Timers: Timers;
    Exceptions: Exceptions;
    DebugValues: DebugValues;
    AllowedClusters: AllowedClusters;
    ErrorCount: number;
    WarningCount: number;
    InfoCount: number;
    AlertCount: number;
    GraphCount: number;
    SourceFileCount: number;
    SourceFiles: SourceFiles;
    ResultCount: number;
    VariableCount: number;
    Variables: Variables;
    TimerCount: number;
    HasDebugValue: boolean;
    ApplicationValueCount: number;
    XmlParams: string;
    AccessFlag: number;
    ClusterFlag: number;
    ResultViewCount: number;
    ResourceURLCount: number;
    DebugValueCount: number;
    WorkflowCount: number;
    Graphs: Graphs;
    ThorLogList: ThorLogList;
    ResourceURLs: ResourceURLs;
}

export function isWorkunit(_: ECLWorkunit | Workunit): _ is Workunit {
    return (<Workunit>_).StateEx !== undefined;
}

export interface WUInfoRequest {
    Wuid: string;
    TruncateEclTo64k?: boolean;
    Type?: string;
    IncludeExceptions?: boolean;
    IncludeGraphs?: boolean;
    IncludeSourceFiles?: boolean;
    IncludeResults?: boolean;
    IncludeResultsViewNames?: boolean;
    IncludeVariables?: boolean;
    IncludeTimers?: boolean;
    IncludeDebugValues?: boolean;
    IncludeApplicationValues?: boolean;
    IncludeWorkflows?: boolean;
    IncludeXmlSchemas?: boolean;
    IncludeResourceURLs?: boolean;
    SuppressResultSchemas?: boolean;
    ThorSlaveIP?: string;
}

export interface ECLSourceFile {
    FileCluster: string;
    Name: string;
    Count: number;
}

export interface SourceFiles {
    ECLSourceFile: ECLSourceFile[];
}

export interface WUInfoResponse {
    Workunit: Workunit;
    AutoRefresh: number;
    CanCompile: boolean;
    ThorSlaveIP?: any;
    ResultViews: any[];
    SecMethod?: any;
}

export interface ApplicationValue {
    Application: string;
    Name: string;
    Value: string;
}

export interface ApplicationValues {
    ApplicationValue: ApplicationValue[];
}

export interface Workunits {
    ECLWorkunit: ECLWorkunit[];
}

export interface WUQueryRequest {
    Wuid?: string;
    Type?: string;
    Cluster?: string;
    RoxieCluster?: string;
    Owner?: string;
    State?: string;
    StartDate?: string;
    EndDate?: string;
    ECL?: string;
    Jobname?: string;
    LogicalFile?: string;
    LogicalFileSearchType?: string;
    ApplicationValues?: {
        ApplicationValue: ApplicationValue[]
    };
    After?: string;
    Before?: string;
    Count?: number;
    PageSize?: number;
    PageStartFrom?: number;
    PageEndAt?: number;
    LastNDays?: number;
    Sortby?: string;
    Descending?: boolean;
    CacheHint?: string;
}

export interface WUQueryResponse {
    Type: string;
    LogicalFileSearchType: string;
    Count: number;
    PageSize: number;
    NextPage: number;
    LastPage: number;
    NumWUs: number;
    First: boolean;
    PageStartFrom: number;
    PageEndAt: number;
    Descending: boolean;
    BasicQuery: string;
    Filters: string;
    CacheHint: number;
    Workunits: Workunits;
}

export interface WUCreateResponse {
    Workunit: Workunit;
}

export interface WUListQueriesRequest {
    QueryID: string;
    QueryName: string;
}

export interface WUListQueriesResponse {
}

export interface WUUpdateRequest {
    Wuid: string;
    State?: string;
    StateOrig?: string;
    Jobname?: string;
    JobnameOrig?: string;
    QueryText?: string;
    Action?: WUAction;
    Description?: string;
    DescriptionOrig?: string;
    AddDrilldownFields?: boolean;
    ResultLimit?: number;
    Protected?: boolean;
    ProtectedOrig?: boolean;
    PriorityClass?: string;
    PriorityLevel?: string;
    Scope?: string;
    ScopeOrig?: string;
    ClusterSelection?: string;
    ClusterOrig?: string;
    XmlParams?: string;
    ThorSlaveIP?: string;
    QueryMainDefinition?: string;
    DebugValues?: any[];
    ApplicationValues?: any[];
}

export interface WUPushEventRequest {
    EventName: string;
    EventText: string;
}

export interface WUPushEventResponse {
}

export interface WUUpdateResponse {
    Workunit: Workunit;
}

export interface WUSubmitRequest {
    Wuid: string;
    Cluster: string;
    Queue?: string;
    Snapshot?: string;
    MaxRunTime?: number;
    BlockTillFinishTimer?: boolean;
    SyntaxCheck?: boolean;
    NotifyCluster?: boolean;
}

export interface WUSubmitResponse {
}

export interface WUResubmitRequest {
    Wuids: string[];
    ResetWorkflow: boolean;
    CloneWorkunit: boolean;
    BlockTillFinishTimer?: number;
}

export interface WU {
    WUID: string;
}

export interface WUs {
    WU: WU[];
}

export interface WUResubmitResponse {
    WUs: WUs;
}
export interface WUQueryDetailsRequest {
    QueryId: string;
    QuerySet: string;
    IncludeStateOnClusters: boolean;
    IncludeSuperFiles: boolean;
    IncludeWsEclAddresses: boolean;
    CheckAllNodes: boolean;
}

export interface WUQueryDetailsResponse {
    QueryId: string;
    QuerySet: string;
    QueryName: string;
    Wuid: string;
    Dll: string;
    Suspended: boolean;
    Activated: boolean;
    SuspendedBy?: any;
    PublishedBy?: any;
    Comment: string;
    LogicalFiles: any[];
    IsLibrary: boolean;
    Priority?: any;
    WUSnapShot: string;
    CompileTime: Date;
    LibrariesUsed: any[];
    CountGraphs: number;
    GraphIds: any[];
    ResourceURLCount: number;
    WsEclAddresses: any[];
}

export type WUActionType = "SetToFailed" | "Pause" | "PauseNow" | "Resume" | "Abort" | "Delete" | "Restore" | "Deschedule" | "Reschedule";
export interface WUActionRequest {
    Wuids: string[];
    WUActionType: WUActionType;
    Cluster?: string;
    Owner?: string;
    State?: string;
    StartDate?: string;
    EndDate?: string;
    ECL?: string;
    Jobname?: string;
    Test?: string;
    CurrentPage?: number;
    PageSize?: number;
    Sortby?: number;
    Descending?: boolean;
    EventServer?: string;
    EventName?: string;
    PageFrom?: number;
    BlockTillFinishTimer?: number;
}

export interface WUActionResult {
    Wuid: string;
    Action: string;
    Result: string;
}

export interface ActionResults {
    WUActionResult: WUActionResult[];
}

export interface WUActionResponse {
    ActionResults: ActionResults;
}

export interface WUGetZAPInfoRequest {
    WUID: string;
}

export interface WUGetZAPInfoResponse {
    WUID: string;
    ESPIPAddress: string;
    ThorIPAddress?: any;
    BuildVersion: string;
    Archive?: any;
}

export interface WUShowScheduledRequest {
    Cluster: string;
    EventName: string;
    PushEventName: string;
    PushEventText: string;
    State: string;
}

export interface WUShowScheduledResponse {
}

export interface WUQuerySetQueryActionRequest {
    Action: string;
    QuerySetName: string;
    Queries: any[];
}

export interface Result {
    QueryId: string;
    Suspended: boolean;
    Success: boolean;
    Code?: any;
    Message?: any;
}

export interface Results2 {
    Result: Result[];
}

export interface WUQuerySetQueryActionResponse {
    Action: string;
    QuerySetName: string;
    Results: Results2;
}

export interface WUQuerySetAliasActionRequest {
    Action: string;
    QuerySetName: string;
    Queries: any[];
}

export interface AliasResult {
    Name?: any;
    Success: boolean;
    Code?: any;
    Message?: any;
}

export interface AliasResults {
    Result: AliasResult[];
}

export interface WUQuerySetAliasActionResponse {
    Action: string;
    QuerySetName: string;
    Results: AliasResults;
}

export interface WUPublishWorkunitRequest {
    Wuid: string;
    Cluster: string;
    JobName: string;
    Activate: string;
    NotifyCluster: boolean;
    Wait: number;
    NoReload: boolean;
    UpdateWorkUnitName: boolean;
    memoryLimit: string;
    TimeLimit: string;
    WarnTimeLimit: string;
    Priority: string;
    RemoteDali: string;
    Comment: string;
    DontCopyFiles: boolean;
    SourceProcess: string;
    AllowForeignFiles: boolean;
    UpdateDfs: boolean;
    UpdateSuperFiles: boolean;
    UpdateCloneFrom: boolean;
    AppendCluster: boolean;
}

export interface WUPublishWorkunitResponse {
    Wuid: string;
    Result?: any;
    QuerySet: string;
    QueryName: string;
    QueryId: string;
    ReloadFailed: boolean;
    Suspended?: any;
    ErrorMessage?: any;
}

export interface WUGetGraphRequest {
    Wuid: string;
    GraphName: string;
    SubGraphId: string;
}

export interface ECLGraphEx {
    Name: string;
    Label: string;
    Type: string;
    Graph: string;
    Complete: boolean;
}

export interface GraphsEx {
    ECLGraphEx: ECLGraphEx[];
}

export interface WUGetGraphResponse {
    Graphs: GraphsEx;
}

export interface WUResultRequest {
    Wuid?: string;
    Sequence?: number;
    ResultName?: string;
    LogicalName?: string;
    Cluster?: string;
    SuppressXmlSchema?: boolean;
    BypassCachedResult?: boolean;
    FilterBy?: any[];
    Start: number;
    Count: number;
}

export interface XmlSchema {
    "@name": string;
    xml: string;
}

export interface Result {
    XmlSchema: XmlSchema;
    "@xmlSchema": string;
    Row: any[];
}

export interface WUResultResponse {
    Wuid: string;
    Sequence: number;
    LogicalName?: any;
    Cluster?: any;
    Name: string;
    Start: number;
    Requested: number;
    Count: number;
    Total: number;
    Result: Result;
}

export interface WUQueryGetGraphRequest {
    Target: string;
    QueryId: string;
    GraphName: string;
    SubGraphId: string;
}

export interface WUQueryGetGraphResponse {
}

export interface WUFileRequest {
    Name: string;
    Wuid: string;
    Type: string;
    Option: string;
    SlaveIP: string;
    IPAddress: string;
    Description: string;
    QuerySet: string;
    Query: string;
    Process: string;
    ClusterGroup: string;
    LogDate: string;
    SlaveNumber: number;
    SizeLimit: number;
    PlainText: string;
}

export interface WUGetStatsRequest {
    WUID: string;
    CreatorType: string;
    Creator: string;
    ScopeType: string;
    Scope: string;
    Kind: string;
    Measure: string;
    MinScopeDepth: number;
    MaxScopeDepth: number;
    IncludeGraphs: boolean;
    CreateDescriptions: boolean;
    MinValue: number;
    MaxValue: number;
    Filter: string;
}

export interface WUStatisticItem {
    Creator: string;
    CreatorType: string;
    Scope: string;
    ScopeType: string;
    TimeStamp: Date;
    Measure: string;
    Kind: string;
    Value: any;
    RawValue: any;
    Wuid: string;
    Max?: number;
    Count?: number;
    Description: string;
}

export interface Statistics {
    WUStatisticItem: WUStatisticItem[];
}

export interface WUGetStatsResponse {
    WUID: string;
    Statistics: Statistics;
}

export interface WUCDebugRequest {
    Wuid: string;
    Command: string;
}

export interface WUCDebugResponse {
    Result: string;
}

export namespace WUDetails {
    export interface AttributeFilter {
        Name?: string;
        ExactValue?: string;
        MinValue?: string;
        MaxValue?: string;
    }

    // Filter.AttributeFilters.WUAttributeFilter.0.Name=WhenGraphStarted
    // Filter.AttributeFilters.WUAttributeFilter.itemcount=1
    export interface Filter {
        MaxDepth?: number;
        Scopes?: string[];
        Ids?: string[];
        ScopeTypes?: string[];
        AttributeFilters?: {
            WUAttributeFilter: AttributeFilter[];
        };
    }

    export interface Nested {
        Depth?: number;
        ScopeTypes?: string[];
    }

    export interface ScopeOverride {
        scopeType: string;
        Attributes: string[];
    }

    export interface AttributeToReturn {
        OnlyDynamic?: boolean;
        MinVersion?: string;
        Measure?: string;
        Attributes?: string[];
        ScopeOverrides?: {
            WUScopeOverride: ScopeOverride[]
        };
    }

    export interface ScopeOptions {
        IncludeMatchedScopesInResults?: boolean;
        IncludeScope?: boolean;
        IncludeId?: boolean;
        IncludeScopeType?: boolean;
    }

    export interface AttributeOptions {
        IncludeName?: boolean;
        IncludeRawValue?: boolean;
        IncludeFormatted?: boolean;
        IncludeMeasure?: boolean;
        IncludeCreator?: boolean;
        IncludeCreatorType?: boolean;
    }

    export interface Request {
        WUID: string;
        Filter?: Filter;
        Nested?: Nested;
        AttributeToReturn?: AttributeToReturn;
        ScopeOptions?: ScopeOptions;
        AttributeOptions?: AttributeOptions;
    }

    export interface Attribute {
        Name: string;
        RawValue?: any;
        Formatted: any;
        Measure?: any;
        Creator?: any;
        CreatorType?: any;
    }

    export interface Attributes {
        Attribute: Attribute[];
    }

    export interface Scope {
        Scope: string;
        Id?: any;
        ScopeType?: any;
        Attributes: Attributes;
    }

    export interface Scopes {
        Scope: Scope[];
    }

    export interface Response {
        maxVersion: number;
        WUID: string;
        Scopes: Scopes;
    }
}

export class Service {
    private _connection: ESPConnection;

    constructor(optsConnection: IOptions | IConnection) {
        this._connection = new ESPConnection(optsConnection, "WsWorkunits", "1.67");
    }

    connection(): ESPConnection {
        return this._connection;
    }

    WUQuery(request: WUQueryRequest = {}): Promise<WUQueryResponse> {
        return this._connection.send("WUQuery", request).then((response) => {
            return deepMixin({ Workunits: { ECLWorkunit: [] } }, response);
        });
    }

    WUInfo(_request: WUInfoRequest): Promise<WUInfoResponse> {
        const request: WUInfoRequest = {
            Wuid: "",
            TruncateEclTo64k: true,
            IncludeExceptions: false,
            IncludeGraphs: false,
            IncludeSourceFiles: false,
            IncludeResults: false,
            IncludeResultsViewNames: false,
            IncludeVariables: false,
            IncludeTimers: false,
            IncludeDebugValues: false,
            IncludeApplicationValues: false,
            IncludeWorkflows: false,
            IncludeXmlSchemas: false,
            IncludeResourceURLs: false,
            SuppressResultSchemas: true,
            ..._request
        };
        return this._connection.send("WUInfo", request);
    }

    WUCreate(): Promise<WUCreateResponse> {
        return this._connection.send("WUCreate");
    }

    private objToESPArray(id: string, obj: any, request: any) {
        let count = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                request[`${id}s.${id}.${count}.Name`] = key;
                request[`${id}s.${id}.${count}.Value`] = obj[key];
                ++count;
            }
        }
        request[`${id}s.${id}.itemcount`] = count;
    }

    WUUpdate(request: WUUpdateRequest, appValues: { [key: string]: string | number | boolean } = {}, debugValues: { [key: string]: string | number | boolean } = {}): Promise<WUUpdateResponse> {
        this.objToESPArray("ApplicationValue", appValues, request);
        this.objToESPArray("DebugValue", debugValues, request);
        return this._connection.send("WUUpdate", request);
    }

    WUSubmit(request: WUSubmitRequest): Promise<WUSubmitResponse> {
        return this._connection.send("WUSubmit", request);
    }

    WUResubmit(request: WUResubmitRequest): Promise<WUResubmitResponse> {
        this._connection.toESPStringArray(request, "Wuids");
        return this._connection.send("WUResubmit", request);
    }

    WUQueryDetails(request: WUQueryDetailsRequest): Promise<WUQueryDetailsResponse> {
        return this._connection.send("WUQueryDetails", request);
    }

    WUListQueries(request: WUListQueriesRequest): Promise<WUListQueriesResponse> {
        return this._connection.send("WUListQueries", request);
    }

    WUPushEvent(request: WUPushEventRequest): Promise<WUPushEventResponse> {
        return this._connection.send("WUPushEvent", request);
    }

    WUAction(request: WUActionRequest): Promise<WUActionResponse> {
        (<any>request).ActionType = request.WUActionType; //  v5.x compatibility
        return this._connection.send("WUAction", request);
    }

    WUGetZAPInfo(request: WUGetZAPInfoRequest): Promise<WUGetZAPInfoResponse> {
        return this._connection.send("WUGetZAPInfo", request);
    }

    WUShowScheduled(request: WUShowScheduledRequest): Promise<WUShowScheduledResponse> {
        return this._connection.send("WUShowScheduled", request);
    }

    WUQuerySetAliasAction(request: WUQuerySetAliasActionRequest): Promise<WUQuerySetAliasActionResponse> {
        return this._connection.send("WUQuerySetAliasAction", request);
    }

    WUQuerySetQueryAction(request: WUQuerySetQueryActionRequest): Promise<WUQuerySetQueryActionResponse> {
        return this._connection.send("WUQuerySetQueryAction", request);
    }

    WUPublishWorkunit(request: WUPublishWorkunitRequest): Promise<WUPublishWorkunitResponse> {
        return this._connection.send("WUPublishWorkunit", request);
    }

    WUGetGraph(request: WUGetGraphRequest): Promise<WUGetGraphResponse> {
        return this._connection.send("WUGetGraph", request);
    }

    WUResult(request: WUResultRequest): Promise<WUResultResponse> {
        return this._connection.send("WUResult", request);
    }

    WUQueryGetGraph(request: WUQueryGetGraphRequest): Promise<WUQueryGetGraphResponse> {
        return this._connection.send("WUQueryGetGraph", request);
    }

    WUFile(request: WUFileRequest): Promise<string> {
        return this._connection.send("WUFile", request, ResponseType.TEXT);
    }

    WUGetStats(request: WUGetStatsRequest): Promise<WUGetStatsResponse> {
        return this._connection.send("WUGetStats", request);
    }

    WUDetails(request: WUDetails.Request): Promise<WUDetails.Response> {
        return this._connection.send("WUDetails", request);
    }

    WUCDebug(request: WUCDebugRequest): Promise<XMLNode> {
        return this._connection.send("WUCDebug", request).then((response) => {
            const retVal = xml2json(response.Result);
            if (retVal.children.length) {
                return retVal.children[0];
            }
            return null;
        });
    }
}
