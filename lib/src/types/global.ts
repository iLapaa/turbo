export type TMDB_API_REQUEST_OPTIONS = {
  method: 'GET' | 'POST' | 'DELETE'
  headers: {
    accept: string
    Authorization: string
  }
}
