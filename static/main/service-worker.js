self.addEventListener('push', function(event) {
    let options = {
        vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
    };

    const promiseChain = self.registration.showNotification(event.data.text(), options);

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
    let url = 'https://news-6n.herokuapp.com';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});