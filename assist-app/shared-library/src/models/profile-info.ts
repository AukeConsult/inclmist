import {QueryDescriptor} from "./query-descriptor";
import {VendorEnum} from "./enum-types";

export interface ProfileAdminUser {
    userId: string
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

// ALL subsriptions on the profile
// contain everthing regarding subscriptions
export interface ProfileSubscription {

    // is possible to subscribe
    canSubscr: boolean
    maxSubscriptions: number

    // fee for signon
    signonFee: number

    // month fee for a subsription
    monthlyFee: number

    // invited users
    invites: ProfileUser []
    // requested memberslip from users
    requests: ProfileUser []

    // subsriptioned users
    subscriptions: ProfileUser []

    // payment done to profile (for later)
    paiedInvoices: []

    // iinvoices, not payed
    openInvoices: []

}

export interface ProfileSettings {
    models: { modelVendor: VendorEnum, modelId: string, apyKey: string } []
}

// contain everything regarding Admin users
export interface ProfileAdminUsers {
    canUpdate: boolean
    users: ProfileAdminUser []
}

//
// basic profile information
//
export interface Profile {

    public?: boolean
    profileName: string
    imageUrl: string
    ownerName?: string

    // reference to owner userid
    ownerId: string
    description?: string

    // settings for profile
    profileSetting: ProfileSettings

    // list of user subsriptions to profile
    subscriptions?: ProfileSubscription

    // querySpcifications under work
    workQueries?: ProfileQueries

    // querySpcifications publiched
    publicedQueries?: ProfileQueries

    // list of users that can admin the profile
    adminUsers: ProfileAdminUsers
}