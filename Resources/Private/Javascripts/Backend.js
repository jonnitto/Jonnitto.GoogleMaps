(function() {
	var events = ['ContentModuleLoaded','PageLoaded','NodeCreated'];
	for (var i = 0; i < events.length; i++) {
		document.addEventListener('Neos.' + events[i], initJonnittoGoogleMaps);
	}
})();
