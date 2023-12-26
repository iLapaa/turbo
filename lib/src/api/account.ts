import { ACCOUNT_DETAILS } from '../types/account'

export const getAccountDetailsAsync = async (
  session_id: string,
  access_token_auth: string,
): Promise<ACCOUNT_DETAILS> => {
  const requestOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${access_token_auth}`,
    },
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/&session_id=${session_id}`,
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
