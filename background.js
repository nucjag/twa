console.log("Extension loaded!");

// Function to process and message the phone number
async function processPhoneNumber(text) {
    console.log("Processing:", text);

    // Remove any non-digit characters
    let cleanedNumber = text.replace(/\D/g, '');

    // Adjust the cleaned number
    if (cleanedNumber.length === 10) {
        cleanedNumber = '7' + cleanedNumber;
    } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith('8')) {
        cleanedNumber = '7' + cleanedNumber.substring(1);
    }

    // Open the special links and close them after a short delay
    try {
        const tab2 = await browser.tabs.create({ url: `https://wa.me/${cleanedNumber}` });
        const tab1 = await browser.tabs.create({ url: `https://t.me/+${cleanedNumber}` });

        setTimeout(() => {
            browser.tabs.remove(tab1.id);
            browser.tabs.remove(tab2.id);
        }, 5000); // 5 seconds delay
    } catch (error) {
        console.error("Error with tabs:", error);
    }
}

// Handle the extension icon click
browser.browserAction.onClicked.addListener(async () => {
    console.log("Extension icon clicked!");

    // Get the phone number from the clipboard
    let text;
    try {
        text = await navigator.clipboard.readText();
    } catch (error) {
        console.error("Error reading from clipboard:", error);
        return;
    }

    processPhoneNumber(text);
});

// Create the context menu item
browser.contextMenus.create({
  id: "message-it",
  title: "Message it",
  contexts: ["selection"],
  icons: {
      "16": "cloud16.png",
      "32": "cloud32.png"
  }
});

// Handle the context menu item click
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "message-it") {
        processPhoneNumber(info.selectionText);
    }
});
