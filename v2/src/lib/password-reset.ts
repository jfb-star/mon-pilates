/**
 * In-memory password reset token store.
 * For production with multiple instances, use Redis or a database table.
 */

interface ResetToken {
  userId: string
  expiresAt: Date
}

// In-memory token store (production should use Redis)
const resetTokens = new Map<string, ResetToken>()

// Clean up expired tokens every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = new Date()
    for (const [token, data] of resetTokens) {
      if (data.expiresAt < now) resetTokens.delete(token)
    }
  }, 10 * 60 * 1000)
}

export function storeResetToken(token: string, userId: string): void {
  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  resetTokens.set(token, { userId, expiresAt })
}

export function validateResetToken(token: string): { userId: string } | null {
  const data = resetTokens.get(token)
  if (!data) return null
  if (data.expiresAt < new Date()) {
    resetTokens.delete(token)
    return null
  }
  return { userId: data.userId }
}

export function deleteResetToken(token: string): void {
  resetTokens.delete(token)
}
