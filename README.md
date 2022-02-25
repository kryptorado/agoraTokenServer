# agoraTokenServer

## Project setup

```
npm install
```

### Compile and serve token generator on port 8080

```
node index.js
```

### How to call it

#### Get an RTC token (for video call)
```
http://localhost:8080/rtc/<channel_name>/publisher/uid/0
```
where <channel_name> will be replaced by some channel name

#### Get an RTM token (for instant messaging)
```
http://localhost:8080/rtm/<uid>
```
where <uid> will be replaced by the user's id

### Call the deployed API

#### Get an RTC token (for video call)
```
https://calm-castle-22371.herokuapp.com/rtc/test/publisher/uid/0
```

#### Get an RTM token (for instant messaging)
```
https://calm-castle-22371.herokuapp.com/rtm/1234
```