if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('SW registered: ', registration);
    }).catch(function(err) {
      console.log('SW registration failed: ', err);
    });
  });
}
