// TMDB_API.ts

import { getAccountDetailsAsync } from "./src/api/account";
import {
  validateReqTokenWithLoginAsync,
  authUserWithURLAsync,
  createRequestTokenAsync,
  createSessionAsync,
} from "./src/api/auth";
import { Multi } from "./src/api/search";
import { ACCOUNT_DETAILS } from "./src/types/account";
import {
  REQUEST_TOKEN_RESPONSE,
  SESSION_RESPONSE,
  USER_WITH_LOGIN,
  USER_WITH_URL_PROPS,
} from "./src/types/auth";
import { MultiQueryParams, SearchMultiResponse } from "./src/types/search";

/**
 * Interface defining the constructor parameters for TMDB_API class.
 */
export type TMDB_API_CONSTRUCTOR = {
  ACCESS_TOKEN: string;
};

/**
 * The main class representing the TMDB (The Movie Database) API client.
 */
export default class TMDB_API {
  private readonly ACCESS_TOKEN: string;

  /**
   * Constructor for TMDB_API class.
   *
   * @param {TMDB_API_CONSTRUCTOR} options - The API key and access token for initializing the TMDB_API instance.
   */
  constructor({ ACCESS_TOKEN }: TMDB_API_CONSTRUCTOR) {
    this.ACCESS_TOKEN = ACCESS_TOKEN;
  }

  /**
   * Namespace for authentication-related methods.
   */
  auth = {
    /**
     * Asynchronously creates a request token.
     *
     * @returns {Promise<REQUEST_TOKEN_RESPONSE>} - A promise that resolves to the response containing the request token.
     */
    createRequestTokenAsync: async (): Promise<REQUEST_TOKEN_RESPONSE> => {
      return createRequestTokenAsync(this.ACCESS_TOKEN);
    },

    /**
     * Asynchronously generates an authentication URL based on the provided access token.
     *
     * @param {USER_WITH_URL_PROPS} props - The properties required for creating the authentication URL.
     * @returns {Promise<string>} - A promise that resolves to the authentication URL.
     */
    authUserWithURLAsync: async ({
      access_token,
      redirect_to,
    }: USER_WITH_URL_PROPS): Promise<string> => {
      return redirect_to !== undefined
        ? await authUserWithURLAsync({ access_token, redirect_to })
        : await authUserWithURLAsync({ access_token });
    },

    /**
     * Asynchronously authenticates a user with login credentials.
     *
     * @param {USER_WITH_LOGIN} credentials - The user login credentials and access token.
     * @returns {Promise<REQUEST_TOKEN_RESPONSE>} - A promise that resolves to the authentication response.
     */
    validateReqTokenWithLoginAsync: async ({
      username,
      password,
      access_token,
    }: USER_WITH_LOGIN): Promise<REQUEST_TOKEN_RESPONSE> => {
      return await validateReqTokenWithLoginAsync(
        {
          username,
          password,
          access_token,
        },
        this.ACCESS_TOKEN
      );
    },

    /**
     * Asynchronously creates a session for the given access token.
     *
     * @param {string} access_token - The access token for session creation.
     * @returns {Promise<SESSION_RESPONSE>} - A promise that resolves to the session creation response.
     */
    createSessionAsync: async (
      access_token: string
    ): Promise<SESSION_RESPONSE> => {
      return await createSessionAsync(access_token, this.ACCESS_TOKEN);
    },
  };

  /**
   * Namespace for account-related methods.
   */
  account = {
    /**
     * Asynchronously retrieves account details for the given session ID.
     *
     * @param {string} session_id - The session ID for retrieving account details.
     * @returns {Promise<ACCOUNT_DETAILS>} - A promise that resolves to the account details.
     */
    getAccountDetailsAsync: async (
      session_id: string
    ): Promise<ACCOUNT_DETAILS> => {
      return await getAccountDetailsAsync(session_id, this.ACCESS_TOKEN);
    },
  };

  /**
   * Namespace for search-related methods.
   */
  search = {
    /**
     * Asynchronously performs a multi-search based on the provided parameters.
     *
     * @param {MultiQueryParams} params - The parameters for the multi-search.
     * @returns {Promise<SearchMultiResponse>} - A promise that resolves to the multi-search response.
     */
    Multi: async (params: MultiQueryParams): Promise<SearchMultiResponse> => {
      return await Multi(params, this.ACCESS_TOKEN);
    },
  };

  /**
   * Convenience method for user login.
   *
   * @param {Object} credentials - The user login credentials (username and password).
   * @returns {Promise<ACCOUNT_DETAILS>} - A promise that resolves to the account details after successful login.
   */
  login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<ACCOUNT_DETAILS> => {
    const token = await this.auth.createRequestTokenAsync();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const generatedURL = await this.auth.authUserWithURLAsync({
      access_token: token.request_token,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const login = await this.auth.validateReqTokenWithLoginAsync({
      username,
      password,
      access_token: token.request_token,
    });

    const session = await this.auth.createSessionAsync(token.request_token);
    const accountDetails = await this.account.getAccountDetailsAsync(
      session.session_id
    );

    return accountDetails;
  };
}
