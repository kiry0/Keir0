Instead, on login, you can deliver two tokens: access token and refresh token. Access token should be stored in Javascript memory and Refresh token should be stored in HttpOnly Cookie. Refresh token is used only and only for creating new access tokens - nothing more.

When user opens new tab, or on site refresh, you need to perform request to create new access token, based on refresh token which is stored in Cookie.

I also strongly recommend to read this article: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/