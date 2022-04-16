
# @coolescoden/accounts

A simple account system using expressjs and mongodb.




## Installation

First you need to install MongoDB from [here](https://www.mongodb.com/try/download/community)

Then you need to install @coolescoden/accounts with npm or yarn

```bash
  npm install @coolescoden/accounts
  # or
  yarn add @coolescoden/accounts
```

## Usage/Examples

```javascript
const express = require('express');
const {accounts} = require('@coolescoden/accounts');

const app = express();

accounts({
    app: app,
    basePath: "/api/v1",
    mongoUrl: "mongodb://localhost:27017/accounts",
    smtp: {
        host: "smtp.my-hostname.com",
        port: 587,
        secure: false,
        auth: {
            user: "my@website.com",
            pass: "MySeCuRePaSsWoRd"
        },
        displayName: "Sample Account System"
    }
})

app.listen(3000, () => {
    console.log("Server running on 3000")
})


```


## Client for Web

There is a Client which you can use to execute tasks on the account system [here](https://github.com/coolescoden/accounts-client)
## Authors

- [@MCTzOCK](https://www.github.com/MCTzOCK)
