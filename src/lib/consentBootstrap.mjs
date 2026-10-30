/**
 * Runs from next/script beforeInteractive, before GoogleTagManager (afterInteractive).
 * Default stays denied. A stored choice is replayed in the same turn so it is already
 * in the dataLayer when gtm.js starts. wait_for_update remains 500 ms so a tag that
 * fires on the default command still sees this queued update. It is not raised,
 * because new visitors would otherwise wait longer for a hit that must stay denied.
 */
export const CONSENT_MODE_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'personalization_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
});

try {
    var storedConsent = localStorage.getItem('cookieConsent');
    var analyticsGranted = false;
    var marketingGranted = false;
    var hasStoredChoice = false;

    if (storedConsent === 'all') {
        analyticsGranted = true;
        marketingGranted = true;
        hasStoredChoice = true;
    } else if (storedConsent === 'necessary') {
        hasStoredChoice = true;
    } else if (storedConsent === 'custom') {
        hasStoredChoice = true;
        try {
            var rawPreferences = localStorage.getItem('cookiePreferences');
            var parsedPreferences = rawPreferences ? JSON.parse(rawPreferences) : null;
            if (parsedPreferences && typeof parsedPreferences === 'object') {
                analyticsGranted = parsedPreferences.analytics === true;
                marketingGranted = parsedPreferences.marketing === true;
            }
        } catch (e) {
            analyticsGranted = false;
            marketingGranted = false;
        }
    }

    if (hasStoredChoice) {
        var adState = marketingGranted ? 'granted' : 'denied';
        var analyticsState = analyticsGranted ? 'granted' : 'denied';
        gtag('consent', 'update', {
            'ad_storage': adState,
            'analytics_storage': analyticsState,
            'ad_user_data': adState,
            'ad_personalization': adState,
            'personalization_storage': analyticsState,
            'functionality_storage': 'granted',
            'security_storage': 'granted'
        });
        window.__fuegoConsentBootstrapped = true;
    }
} catch (e) {}

gtag('js', new Date());
`;
