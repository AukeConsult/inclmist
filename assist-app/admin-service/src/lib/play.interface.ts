
export interface Comment {
  id: string
  userId?: string
  name?: string
  text?: string
  timeAdded: Date
  order: number
  tip?: Tip
}

export interface Tip {
  id: string
  songId?: string
  timeTip?: Date
  timePlayed?: Date
  userIdPlayed?: string
  userNamePlayed?: string
  namePlayed?: string
  credits: number
  amount: number
}

export interface UserInfo {
  id: string
  userName?: string
  name?: string
  balanceCreditFree?: number
  balanceCredit?: number
  balanceAmount?: number
  usedCredit?: number
  usedAmount?: number
  isDj: boolean
  played?: Comment[]
}

export interface Song {
  id: string
  title: string
  artist?: string
  addedBy?: string
  addedById?: string
  addedTime?: Date
  lastPlayed?: Date
}

export interface EventPost {
  id: string
  order: number
  text?: string
  song?: Song
  openTipsCredit?: number
  playedTipsCredit?: number
  openTipsAmount?: number
  playedTipsAmount?: number
  comments?: Comment[]
  tipHistory?: Tip[]
  addedBy?: string
  addedById?: string
  addedTime?: Date
}

export interface PlayEventSettle {
  eventId: string
  totalTips: number
  debitAmount: number
  creditAmount: number
  creditToId: string
  creditTime: Date
}

export interface PlayEvent {

  id: string
  title: string,
  description?: string,
  location?: string,
  locationId?: string,
  locationUrl?: URL
  date?: Date
  storedTime?: Date
  addedBy?: string
  addedById?: string
  addedTime?: Date
  ownerId?: string
  posts: EventPost[]
  usersAttended?: []
  settlement?: PlayEventSettle

}
