import {
  REQUEST_TOKEN_RESPONSE,
  SESSION_RESPONSE,
  USER_WITH_LOGIN,
  USER_WITH_URL_PROPS,
} from '../types/auth'
import { TMDB_API_REQUEST_OPTIONS } from '../types/global'

export const createRequestTokenAsync = async (
  access_token_auth: string,
): Promise<REQUEST_TOKEN_RESPONSE> => {
  const requestOptions: TMDB_API_REQUEST_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${access_token_auth}`,
    },
  }

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/token/new',
      requestOptions,
    )

    if (!response.ok) {
      // Check if the response status is not in the range 200-299
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    const requestToken: REQUEST_TOKEN_RESPONSE = data
    return requestToken as REQUEST_TOKEN_RESPONSE
  } catch (error) {
    console.error('Error creating request token:', error)
    throw error // Propagate the error
  }
}

export const authUserWithURLAsync = async ({
  access_token,
  redirect_to,
}: USER_WITH_URL_PROPS): Promise<string> => {
  return redirect_to != undefined
    ? await `https://www.themoviedb.org/authenticate/${access_token}?redirect_to=${redirect_to.url}`
    : await `https://www.themoviedb.org/authenticate/${access_token}`
}

export const validateReqTokenWithLoginAsync = async (
  { username, password, access_token }: USER_WITH_LOGIN,
  access_token_auth: string,
) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${access_token_auth}`,
    },
    body: JSON.stringify({
      username: username,
      password: password,
      request_token: access_token,
    }),
  }

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/token/validate_with_login',
      requestOptions,
    )

    if (!response.ok) {
      // Check if the response status is not in the range 200-299
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    const requestToken = data
    return requestToken
  } catch (error) {
    console.error('Error loging in', error)
    throw error // Propagate the error
  }
}

export const createSessionAsync = async (
  access_token: string,
  access_token_auth: string,
): Promise<SESSION_RESPONSE> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${access_token_auth}`,
    },
    body: JSON.stringify({
      request_token: access_token,
    }),
  }

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/session/new',
      requestOptions,
    )

    if (!response.ok) {
      // Check if the response status is not in the range 200-299
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    const requestToken = data
    return requestToken
  } catch (error) {
    console.error('Error loging in', error)
    throw error // Propagate the error
  }
}
