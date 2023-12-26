import { MultiQueryParams, SearchMultiResponse } from '../types/search'

export const Multi = async (
  params: MultiQueryParams,
  access_token_auth: string,
): Promise<SearchMultiResponse> => {
  try {
    const queryString = `query=${encodeURIComponent(
      params.query,
    )}&include_adult=${params.include_adult || false}&language=${
      params.language || 'en-US'
    }&page=${params.page || 1}`

    const url = `https://api.themoviedb.org/3/search/multi?${queryString}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token_auth}`,
      },
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      // Handle non-successful response (e.g., 4xx, 5xx)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: SearchMultiResponse = await response.json()

    return data
  } catch (err) {
    // Handle any other errors (e.g., network issues)
    console.error(err)
    throw err // Propagate the error to the calling code
  }
}
