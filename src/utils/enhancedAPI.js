// Enhanced API methods with pagination support for user posts and comments
import { SidechatAPIClient } from 'sidechat.js';

/**
 * Enhanced version of getUserContent that supports pagination
 * @param {SidechatAPIClient} apiClient - The API client instance
 * @param {"posts"|"comments"} contentType - type of user content to fetch
 * @param {string} [cursor] - pagination cursor for fetching next page
 * @returns {Promise<{posts: Array, cursor: string, hasMore: boolean}>}
 */
export async function getUserContentPaginated(apiClient, contentType, cursor = null) {
  if (!apiClient.userToken) {
    throw new Error("User is not authenticated.");
  }

  let type = contentType === "posts" ? "my_posts" : "my_comments";

  try {
    const params = new URLSearchParams({ type });
    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`${apiClient.apiRoot}/v1/posts?${params}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "App-Version": "6.0.0",
        Dnt: 1,
        Authorization: `Bearer ${apiClient.userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const json = await response.json();

    return {
      posts: json.posts || [],
      cursor: json.cursor || null,
      hasMore: !!json.cursor, // If there's a cursor, there are more posts
    };
  } catch (err) {
    console.error('Enhanced getUserContent error:', err);
    throw new Error(`Failed to get paginated content: ${err.message}`);
  }
}
