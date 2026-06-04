import crypto from "node:crypto"

const ALGORITHM = "aes-256-gcm"
 
const getEncryptionKey = (): Buffer => {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) {
    throw new Error(
      "Critical Configuration Failure: ENCRYPTION_SECRET environment variable is not defined."
    )
  }
  
  const key = Buffer.from(secret, "hex")
  if (key.length !== 32) {
    throw new Error(
      `Critical Configuration Failure: ENCRYPTION_SECRET must represent exactly 32 bytes. Found key length: ${key.length} bytes.`
    )
  }
  return key
}

interface EncryptionResult {
  encryptedData: string
  iv: string
  tag: string
}

export function encrypt(text: string): EncryptionResult {
  const iv = crypto.randomBytes(12)  
  const key = getEncryptionKey()
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  const tag = cipher.getAuthTag().toString("hex")

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    tag: tag,
  }
}

export function decrypt(
  encryptedText: string,
  ivHex: string,
  tagHex: string
): string {
  const key = getEncryptionKey()
  const iv = Buffer.from(ivHex, "hex")
  const tag = Buffer.from(tagHex, "hex")
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  
  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}
