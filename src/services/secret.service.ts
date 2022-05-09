import { JwtCertificate } from '../types/jwt'
import { AuthoritySecret } from '../types/secret'
import { SecretsManager } from './aws.service'

class SecretService {
  private authoritySecret: AuthoritySecret

  getSecret<T = any>(secretId: string): Promise<T> {
    return new Promise((resolve, reject) => {
      SecretsManager.getSecretValue({
        SecretId: secretId
      })
        .promise()
        .then((data) => {
          let value = ''
          if ('SecretString' in data) {
            value = data.SecretString
          } else {
            const buff = Buffer.from(data.SecretBinary as String, 'base64')
            value = buff.toString()
          }
          resolve(JSON.parse(value) as T)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async getAuthoritySecret(): Promise<AuthoritySecret> {
    if (!this.authoritySecret) {
      this.authoritySecret = await this.getSecret<AuthoritySecret>(
        process.env.AUTHORITY_SECRET_ID
      )
    }
    return this.authoritySecret
  }

  async getJwtCertificate(): Promise<JwtCertificate> {
    const secret = await this.getAuthoritySecret()

    return {
      privateKey: secret?.privateKey,
      publicKey: secret?.publicKey
    }
  }

  async getAuthClientDefault(): Promise<string> {
    const secret = await this.getAuthoritySecret()
    return secret?.clientDefault
  }
}

export default new SecretService()
