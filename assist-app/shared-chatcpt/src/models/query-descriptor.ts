
export interface FileRefs {
    fileName: string
    storageRef: string
    modeStoreageRef: string
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

export interface QueryDescriptor {
    id: string,
    profileId?: string
    description: string
    externalModelId?: string;
    instructions: string;
    maxSizeHistory: number
    files?: FileRefs []
    externalLinks?: LinkRefs []
    apiRefs?: LinkRefs []
    dbRefs?: DbRefs []
    added: Date
    lastused: Date
}
