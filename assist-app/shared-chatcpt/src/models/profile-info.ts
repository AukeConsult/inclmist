import {QueryDescriptor} from "./query-descriptor";

export interface ProfileInfo {
    Id: string
    public: boolean
    profilesName: string
    ownerName: string
    ownerId: string
    description: string
    pictures: []
    links: []
    queries?: QueryDescriptor[]
    queriyRefs?: string[]
    activeQuery?: QueryDescriptor
    subscriptions: []
}