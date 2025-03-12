import {QueryDescriptor} from "./query-descriptor";

export interface ProfileAdminUser {
    userid: string
    role: string
    name: string
}

// subsribers to the profile
export interface ProfileUser {
    userid: string
    email: string
    phone: string
    name: string
    role: string
    added: Date
    active: boolean
    closed: Date
}

// contain everything regarding Queries
export interface ProfileQueries {
    queries?: QueryDescriptor[]
    queryRefs?: string[]
    activeQueryDescriptor?: QueryDescriptor
}

// contain everthing regarding subscriptions
export interface ProfileSubscription {
    canSubscr: boolean
    maxSubscriptions: number
    signonFee: number
    monthlyFee: number
    invites: ProfileUser []
    requests: ProfileUser []
    subscriptions: ProfileUser []
    payments: []
    openPayments: []
}

// contain everything regarding Admin users
export interface ProfileAdminUsers {
    canUpdate: boolean
    users: ProfileAdminUser[]
}

// basic profile information
export interface ProfileInfo {
    Id: string
    public: boolean
    profileName: string
    ownerName: string
    ownerId: string
    description: string
    pictures: []
    links: []
    subscriptions?: ProfileSubscription
    queries?: ProfileQueries
    adminUsers?: ProfileAdminUsers
}