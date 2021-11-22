export const getDbName = (userName?: string | null) => (userName ? `${userName}_db` : '')
