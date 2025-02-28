

export function newId() : string {
  return crypto.randomUUID().substring(0,10).replace('-','')
}

