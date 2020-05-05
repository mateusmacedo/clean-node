export interface UpdateAccountAccessTokenRepository {
  updateAccessToken (id: string, accessToken: string): Promise<void>
}
