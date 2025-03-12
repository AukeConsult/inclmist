import {QueryDescriptor} from "./query-descriptor";

export interface ProfileQueryInfo {
    queries?: QueryDescriptor[]
    queryRefs?: string[]
    activeQueryDescriptor?: QueryDescriptor
}

export interface ProfileSubcrInfo {
    type: string
    subscriptions: []
}

export interface ProfileInfo {
    Id: string
    public: boolean
    profileName: string
    ownerName: string
    ownerId: string
    description: string
    pictures: []
    links: []
    subscrInfo?: ProfileSubcrInfo
    queyInfo?: ProfileQueryInfo
}