export interface User {
  username: string
  password: string
  name: string
  email: string
  active: boolean
  avatar?: string
  created_at: string
  updated_at?: string
}
export interface UserChangePassword {
  username: string
  password: string
  newpassword: string
}
