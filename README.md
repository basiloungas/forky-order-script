# Forky order script

A simple script to get the daily menu and based on some configurable constraints, select a dish and order it.
The user specifies address and favorite timeslot in the config.

If the script fails to place the order on the specified timeslot, it retries with next timeslots, untill there are none left.

The ConstraintsEngine is rather modular and allows for easy extension by just creating new Constraints.
Constraints are configurable from the main config.json file. Specific configuration per days is available.

Finally it features a custom modular ErrorHandler configurable from the main config.json file.

## Requirements

- node
- yarn globally installed (npm -g install yarn)

## Setup

```sh
$ yarn install
```

### Execute

```sh
$ yarn start
```

#### For development:

```sh
$ yarn start-dev
```

#### Tests

No tests implemented

## Config.json

The tool is configurable by means of changing the config.json file.

There are two tope level keys that are user specific with Forky specific ids:

```json
  ...
  "timeslotId": 10,
  "addressId": "2488",
  ...
```

### Constraints details

Include modules by using their name as key, and declaring their configData as values.
There is a global key and then 'mon', tue', 'wed'... keys for specific daily config.

Since the above top level keys ('glob', 'mon', ...) are arrays, you can specify multilpe groups of constraints.
These groups have an OR relationship, meaning that if the first group fails and the second succeeds, the dish will be selected.

Inside each group you can specify one or more contraints. Inside the group the relationship is AND.
So all contraints should be true in order for the group to be succeed and the dish to be selected.

The whole mechanism stops once one contraint group succeeds.


```json
  ...
  "constraints": {
    "global": [
      {
        "vegetarian": true
      },
      {
        "category": "light"
      }
    ],
    "sun": [
      {
        "category": "classic",
        "calories": {
          "max": 1500
        }
      }
    ]
  }
  ...
```

### Providers details

pretty selfexplanatory

```json
  ...
  "providers": {
    "forky": {
      "baseUrl": "http://devel.forky.gr",
      "token": "...",
      "getMenuEndpoint": "/api/v2/today_dishes.json",
      "postOrderEndpoint": "/api/v2/orders.json"
    }
  },
  ...
```

### ErrorHandlers details

Include modules by using their name as key, and declaring their configData as values.

```json
  ...
  "errorHandlers":{
    "consoleLogger" : true
  },
  ...
```

## Creating a new Constraint

In order to create and use a new constraint the user has to create a new class under `libs/constraints-engine/constraints/new-class-dir` and declare it in the default exports file in `libs/constraints-engine/constraints/index.js`.

The key used to export it, is the name that should be used in the config file to enable it.

Example: If the new contraint was named **lactose-free** then the definition should be placed in `libs/constraints-engine/constraints/lactose-free/index.js`, and this should be added in `libs/constraints-engine/constraints/index.js`:

```javascript
import LactoseFreeConstraint from './lactose-free';

export default {
  ...
  lactoseFree: LactoseFreeConstraint,
  ...
};
```

Then in config.json you can do:

```json
  ...
  "constraints": {
    "global": [
      ...
      {
        "lactoseFree": "whatever-data-needed"
      },
      ...
    ],
    ...
```

and us this constraint.

## Creating a new ErrorHandler

In order to create and use a new ErrorHandler the user has to create a new class under `libs/error-handler/handlers/new-class-dir` and declare it in the default exports file in `libs/error-handler/handlers/index.js`.

The key used to export it, is the name that should be used in the config file to enable it.

Example: If the new contraint was named **sms-notification** then the definition should be placed in `libs/error-handler/handlers/sms-notification/index.js`, and this should be added in `libs/error-handler/handlers/index.js`:

```javascript
import SmsNotification from './sms-notification';

export default {
  ...
  smsNotification: SmsNotification,
  ...
};
```

Then in config.json you can do:

```json
  ...
  "errorHandlers":{
    ...
    "smsNotification" : "some_config_data"
    ...
  },
```

and us this handler as well.

## TODO / Improvements:

- Get config options from CLI
- Get token from ENV
- Implement more Constraints
- Better implementation of trying next timeslot
- Constraints should select all available dishes and try next dish if one has no portions left
