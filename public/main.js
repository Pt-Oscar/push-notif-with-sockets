const PUBLIC_VAPID_KEY = "BLNMNimwRN-SCnlAA9xYB2nPGT757ku8F4LqYSk8eGgjyAYxxuVvqkoo-8z979Ioepz1pX66UboUbkQ0T00Qcww";
const ws = new WebSocket('ws://localhost:8082');

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


  const cabinetUser = () => {
    ws.onopen = () => {
        console.log('We are connected!');
    }
    ws.onmessage = async (e) => {
      //  const newData = await JSON.parse(e.data);
       console.log(e)
       return e.data
    };
    ws.onclose = () => {
        console.log('Client close!')
    };
  };


  const subscription = async () => {
    //service worker  
    const register =  await navigator.serviceWorker.register('./worker.js', {
          scope: '/'
      })
      console.log('new SW');
  
     const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      })
     await fetch('/suscription', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
              "Content-Type": "application/json"
          }
      })
      console.log('suscribed')
  }

  
  subscription();
  cabinetUser();