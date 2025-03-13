
export interface FileRefs {
    fileName: string
    storageRef: string
    modelStoreageRef: string
    fileContent?: object
}

export interface LinkRefs {
    url: string
    parameters: string
}

export interface DbRefs {
    url: string
    logonUserId: string
    logonPassword: string
    dataTable: string
    parameters: string
}

export interface QueryParameters {
    vendor: string
    modelId: string;
    instructions: string;
    max_tokens: number,
    temperature: number,
    files?: FileRefs []
    externalLinks?: LinkRefs []
    apiRefs?: LinkRefs []
    dbRefs?: DbRefs []
}

export interface QueryDescriptor {
    id: string,
    profileId: string
    description: string
    added: Date
    lastused: Date
    queryParameters: QueryParameters []
}
