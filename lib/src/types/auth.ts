export type REQUEST_TOKEN_RESPONSE = {
  success?: true
  expirest_at?: string
  request_token: string
}

export type USER_WITH_LOGIN = {
  username: string
  password: string
  access_token: string
}

export type SESSION_RESPONSE = {
  session_id: string
}

export type USER_WITH_URL_PROPS = {
  access_token: string
  redirect_to?: {
    url: string
  }
}
