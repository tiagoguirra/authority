import { JwtCertificate } from './jwt'

export interface AuthoritySecret extends JwtCertificate {
  clientDefault: string
}
