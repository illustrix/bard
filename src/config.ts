import dotenv from 'dotenv'

dotenv.config({
  override: true,
})

const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  lark: {
    encryptKey: process.env.LARK_ENCRYPT_KEY || '',
    verificationToken: process.env.LARK_VERIFICATION_TOKEN || '',
    appId: process.env.LARK_APP_ID || '',
    appSecret: process.env.LARK_APP_SECRET || '',
  },
  port: process.env.PORT || 7014,
  logLevel: process.env.LOG_LEVEL || 'info',
}

export default config
