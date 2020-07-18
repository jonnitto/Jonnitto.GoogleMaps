const events = ['ContentModuleLoaded', 'PageLoaded', 'NodeCreated'];
for (let i = 0; i < events.length; i++) {
    document.addEventListener('Neos.' + events[i], initJonnittoGoogleMaps);
}
