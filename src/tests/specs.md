1. Usernames/ID's
Make sure your usernames/user IDs are case-insensitive. User 'smith' and user 'Smith' should be the same user. Usernames should also be unique.

- string ✓
- alphanumeric ✓
- min: 4 / max: 40 ✓
- lowercase ✓
- required: true ✓
- unique: true ✓

2. Password
Minimum length of the passwords should be enforced by the application. Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B). Maximum password length should not be set too low, as it will prevent users from creating passphrases. A common maximum length is 64 characters due to limitations in certain hashing algorithms. It is important to set a maximum password length to prevent long password Denial of Service attacks.

- string ✓
- unicode/whitespaces ✓
- min: 8 / max: 64
- required: true ✓
- strength meter implementation?: true ✓
