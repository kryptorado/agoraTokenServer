const express = require('express');
const {RtcTokenBuilder, RtcRole, RtmRole, RtmTokenBuilder} = require('agora-access-token');
require('dotenv').config()

const app = express();

// ensure a fresh token is generated everytime by disallowing caching
const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateRTCToken = (req, resp) => { 
    resp.header('Acess-Control-Allow-Origin', '*');

  const channelName = req.params.channel;
  console.log("channel name is: " + channelName);
    if (!channelName) {
      return resp.status(500).json({ 'error': 'channel is required' });
    }

    let uid = req.params.uid;
    if(!uid || uid === '') {
      return resp.status(500).json({ 'error': 'uid is required' });
    }
    // get role
    let role;
    if (req.params.role === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
      role = RtcRole.SUBSCRIBER
    } else {
      return resp.status(500).json({ 'error': 'role is incorrect' });
    }

    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    let token;
    if (req.params.tokentype === 'userAccount') {
      token = RtcTokenBuilder.buildTokenWithAccount(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
      token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else {
      return resp.status(500).json({ 'error': 'token type is invalid' });
  }
  console.log("the token returned is: ", token);
    return resp.json({ 'rtcToken': token });
};


const generateRTMToken = (req, resp) => { 
  const user = req.params.uid
  const role = RtmRole.Rtm_User;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(process.env.APP_ID, process.env.APP_CERTIFICATE, user, role, expirationTimestamp);
  return resp.json({ 'rtmToken': token });
};


app.get('/rtc/:channel/:role/:tokentype/:uid', nocache , generateRTCToken)
app.get('/rtm/:uid', nocache , generateRTMToken)


app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });