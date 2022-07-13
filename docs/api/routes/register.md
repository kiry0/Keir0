# Register
Registers a user to the database.

- **Method** : `POST`
- **URL** : `/api/v1/auth/register`
- **Params** : `{ *firstName, *middleName, *lastName, *?email, *?username, *?phoneNumber, *password }`
**Specifications**:
`firstName` 
- <String>
- Min(1)/Max(64)
- Required
`middleName`
- <String>
- Min(1)/Max(64)
- Required
- `lastName`
- <String>
- Min(1)/Max(64)
- Required
`emailAddress`
- <String/email>
- Min(3)/Max(320)
- Lowercase
`phoneNumber`
- <Object/String>
Is validated via a custom function that uses Google's libphonenumber library.
`userName`
- <String>
- Alphanum
- Min(4)/Max(40)
- Lowercase
`password`
- <String>
- Min(8)/Max(64)
- Required
Is validated via a custom function that uses zxcvbn.

## Examples
```javascript
const req = {
    firstName: "Carl",
    middleName: "Wong",
    lastName: "Hansen",
    emailAddress: "detercarlhansen@gmail.com", // emailAddress, phoneNumber, username are all partially required, so you are able to create an account with either emailAddress, phoneNumber, username. So even with just 1 valid argument, you can keep the other 2 empty. But for us to be able to receive a verification code you will need to provide one of the ff: emailAddress, phoneNumber.
    phoneNumber: {
        countryCallingCode: 45,
        nationalNumber: 71684140
    }, // Is the same as: phoneNumber: "+4571684140"
    username: "Keir0",
    password: "$MHx26533"
};
```
## Success response
- **Code**: `201 Created` - Successfully registered user to the database.

## Error responses
- **Code** : `422 Invalid Form Body!` - If one of the ff: `{ *firstName, *lastName, *middleName, *?email, *?username, *?phoneNumber, *password }` are invalid.

- **Code** : `409 Conflict` - If one of the ff: `{ email, username, phoneNumber}` are already taken.

- **Code**: `422 Unprocessable Entity` - This error with it's specific error code will only throw if you either have a weak password, or invalid phone number.