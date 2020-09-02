


browser.browserAction.onClicked.addListener(() => {

    let sidebar_url = browser.runtime.getURL("/sidebar.html");

    browser.sidebarAction.setPanel({panel: sidebar_url });
    browser.sidebarAction.open();

});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message.action == "set_panel_url") {
        browser.sidebarAction.setPanel({panel: message.panel_url});
    } 

});







// Set the default settings for the first time if they don't exist
if(browser.storage.local.get('version') != '1.0.1') {

    browser.storage.local.set({
        'version': '1.0.1',
        'settings': {
            'n5single': true,
            'n5compound': true,
            'n4single': false,
            'n4compound': false,
            'n3single': false,
            'n3compound': false,
            'n2single': false,
            'n2compound': false,
            'showReadings': false,
            'sidebar': 'jisho'
    
        }
    });

}