# Notifications
A Reactive application that display notifications with live updates.

## Application
The application build from two layers:
- BE app that exposes WS/HTTP interfaces to communicate with clients.
- FE app that connects to the WS server and display notifications with live updates.

### FE - React
The FE application is a React application written with JS and TS.

Check out the live demo: https://aqueous-woodland-47601.herokuapp.com

The application has 2 screens:
- Login - a simple form to get the user name
- Notifications - a screen that display notifications with live updates using WS.

### BE - Node.js
The BE is a Node.js application that expose two interfaces:

### WS
  - Clients can connect to the WS server and send `Action`s. The only available `Action` currently supported is `GetMessages` but the protocol is extendable.
  - Clients that are connected to the WS will get notification each time a notification is created in the form of an `Action`. 
  - Message |

```ts
export class Message {
    id: string
    from: string
    channel: string
    msg: string
    createdAt: Date
}
```
```json
{
  "type": "MessagesUpdate",
  "organization": "user-1611188845474",
  "data":{
    "id": 123,
    "from": "user-1611188845474",
    "channel": "user-1611188845474",
    "msg": "user-1611188845474"
  }
}
```

```yaml
protocol: wss
Path: `/ws`
Parameters: 
  query: username
  required: true
Examples:
  - `ws://localhost:8080/ws?username=cyborg.morty@pickle.rick`
```
```ts
 export class Action<T> {
    type: ActionType
    msg?: T
}
```
 
### HTTP
  - Clients can create new notifications.
  - Clients can get all notifications.
 
```yaml
Protocol: http
Path: `/notifications`
Method: POST
Parameters: 
  - query: username
    required: true
  - body:
      eventId: 
        type: string
        required: true
      statue:
        type: string
        required: true
Examples:
  - `curl --location --request POST 'http://localhost:8080/notifications?username=pini' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "eventId": "8c329494-8e39-4dc0-ad5c-ba569881c3c1",
        "status": "offline"
      }'`
```
 
```yaml
Protocol: http
Path: `/notifications`
Method: GET
Parameters: 
  - query: username
    required: true
Examples:
  - `curl --location --request GET 'http://localhost:8080/notifications?username=pini'`
```

## Development
To run this locally you need to have a running mongo, I use docker:
`docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.4.1`
To run the project locally run the following:
```bash
  npm run install:all # install dependencies
  npm run run:all
```

## What's Next
- Add test suite
- Test all the THINGz
