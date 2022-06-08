# Register
Registers a user to the database.
- **Method** : `POST`
- **URL** : `/api/v1/auth/register`
- **Params** : `{ *firstName, *lastName, *?email, *?username, *?phoneNumber, *password }`

## Success response
- **Code**: `201 Created` - Successfully registered user to the database.

## Error responses
- **Code** : `422 Invalid Form Body!` - if one of the ff: `{ *firstName, *lastName, *?email, *?username, *?phoneNumber, *password }` are invalid inputs. An example would be if emailAddress, phoneNumber, username were all missing, as they are between *? types, meaning they are either required/optional depending on the request. The same error will throw if the data being sent to the server was an incorrect data type, eg: username not being a string, alphanumeric, with less than 4 characters long, and more than 40 characters long.
- **Code** : `409 Conflict` - If one of the ff: `{ email, username, phoneNumber}` are already taken.