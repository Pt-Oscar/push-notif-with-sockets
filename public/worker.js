console.log('service worker');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('notification received')
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: 'https://i.pinimg.com/originals/98/fe/f7/98fef7dd85d83a6c7accf07be67cb85a.jpg'
    })
})