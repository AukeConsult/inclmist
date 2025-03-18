import {ModelEnum, VendorEnum} from "./enum-types";

// refenrence to files
export interface FileRefs {

    // name of file whe uploaded
    fileName: string

    // content object for the file
    // after store to storage, empties
    fileContent?: object

    // storage ref after upload and store on Storage (Google store)
    storageRef: string

    // storage ref after upload to model
    modelStoreageRef: string

}

// ref links to websites to scan
export interface LinkRefs {
    url: string
    parameters: string
}

// ref to databases
export interface DbRefs {
    url: string
    logonUserId: string
    logonPassword: string
    dataTable: string
    parameters: string
}

// query model parameters
export interface QueryParameters {

    // the vendor (chatgpt)
    vendor: VendorEnum

    // the id of the model to use
    modelId: ModelEnum | string | undefined;

    // instructions to the model
    // send to model on every query to instuct the model how to answer
    instructions: string;

    // size of answer in tokens
    max_tokens: number,
    // how deeps is model search (0-1), 1, very deeps
    temperature: number,

    // reference to files added to model and used for tuning
    files?: FileRefs []

    // reference to links added to model and used for tuning (explain later)
    externalLinks?: LinkRefs []

    // reference to api links for data used to tuning (explain later)
    apiRefs?: LinkRefs []

    // reference to DB looks up for data used for traings and intitial query (explain later)
    dbRefs?: DbRefs []

}

// Tuned Query, man description
export interface QueryDescriptor {

    // self ref ID
    id?: string,

    // reference to profile owning the qquery
    pid: string

    // description of the query
    description: string

    // keyWords (space separated) used for searching the Query in frontend
    keyWords: string

    // some image and or logo for the query
    imageUrl: string
    image: object

    added: Date
    lastused: Date

    // parameters for query
    // can be more than one, i.e on question look opp multiple models,
    // for first version only one
    queryParameters: QueryParameters []


}
