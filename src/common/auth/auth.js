﻿angular.module('auth', ['auth.service', 'auth.messages', 'localizedMessages','auth.interceptor', 'auth.ssoProviders'])
.run(function (AUTH_MESSAGES, localizedMessages) {
    // Add authentication messages to localized message collection but allow app to over write
    localizedMessages.addIfNotExists(AUTH_MESSAGES);
}
);
   