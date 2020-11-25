const {Router} = require('express');
const router = Router();
const WebSocket = require('ws');

const webpush = require('../webpush');
let pushSubscription;

//websocket

let connectedUsers = [];
let arrayKey;
const wss = new WebSocket.Server({ port: 8082 });
wss.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', async (data) => {
    const newData = await JSON.parse(data);
    await connectedUsers.push(newData);
    arrayKey = connectedUsers.map((item, key) => {
      if (item.idSystemUser === newData.idSystemUser) {
        return key;
      }
    });
  });
  ws.on('close', () => {
    // const deleteIndex = parseInt(arrayKey);
    // connectedUsers.splice(deleteIndex, 1);
    // console.log('Client disconnected ', connectedUsers);
  });
});

router.post('/ping', async (req, res, next) => {
  await wss.clients.forEach(async (client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('passsssssssssssss')
      setTimeout(async() => {
        console.log('CONNECTED USERS >> ', connectedUsers);
        const payload = JSON.stringify({
                  title: connectedUsers[0].profileName,
                  message: 'Se ha conectado'
              })
              await webpush.sendNotification(pushSubscription, payload)
              console.log('correcet')
        client.send(JSON.stringify(connectedUsers));
      }, 1500);
    }
  });
  return res.send('oong');
});

router.post('/pong', (req, res, next) => {
  const { dataProfile } = req.body;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      setTimeout(() => {
        // connectedUsers.splice(arrayKey, 1);
        const newArray = connectedUsers.filter((item) => {
          if (item.idSystemUser !== dataProfile.idSystemUser) {
            return item;
          }
        });

        connectedUsers = newArray;
        console.log(connectedUsers, '>>>>>>>>>>>>>>>>>>>>>>>>');
        client.send(JSON.stringify(connectedUsers));
      }, 1500);
    }
  });
});



//push notifications
// router.post('/suscription', async (req,res,next) => {
//     pushSubscription = req.body;
//     res.status(200).json();
    
//     const payload = JSON.stringify({
//         title: 'PUTO',
//         message: 'PRRO'
//     })
//     await webpush.sendNotification(pushSubscription, payload)
//     console.log('correcet')
// })

router.post('/suscription', async (req,res,next) => {
  pushSubscription = req.body;
  res.status(200).json();
})



module.exports = router;