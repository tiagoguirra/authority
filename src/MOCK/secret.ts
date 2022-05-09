import { JwtCertificate } from '../types/jwt'
import { AuthoritySecret } from '../types/secret'

export const mockCertificate: JwtCertificate = {
  privateKey: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwMjINCn0.16HRpYj-n4jYSbIWS99SrHXE5BN3KVdIl6d2X_QAi8E',
  publicKey: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwMjINCn0.CwXoti9pZbHQrKKKDQgCnXYg8W9cnPQu24ArBam87MQ'
}
export const mockSecret: AuthoritySecret = {
  certificate: mockCertificate,
  clientDefault: '123456789'
}
