# Privacy Policy

Last updated: 2026-06-28

PDF Downloader is a Chrome extension that detects PDF document requests while the user browses and lets the user open or download captured PDF files from the extension popup.

## Data Processed

The extension processes PDF request information needed for its single purpose, including PDF URLs, detected file names, request timing, tab and frame identifiers, request headers, response headers, and related page context. Request headers may include authentication or session context that the browser already sends to the website. This context is used only so the selected PDF can be opened or downloaded in the same browser session.

The extension does not collect names, email addresses, payment information, health information, personal communications, precise location, keystrokes, mouse movements, or full browsing history unrelated to detected PDF requests.

## Local Storage

Recent PDF request records are stored locally in the user's browser with `chrome.storage.local`. The extension keeps a limited recent history for the popup list, search, filters, open, download, and clear actions. Users can clear the stored records from the extension popup at any time.

## Data Sharing

The extension does not upload PDF contents, captured URLs, request headers, browsing records, or authentication context to any developer server. The extension does not sell user data and does not share user data with third parties for advertising, analytics, credit, lending, or unrelated purposes.

When the user chooses to open or download a PDF, the browser sends the necessary request only to the original website that hosts that PDF.

## Remote Code

The extension does not execute remote JavaScript or WebAssembly. Its scripts and assets are packaged with the extension.

## Contact

For support, use the GitHub repository issue tracker for this project.
