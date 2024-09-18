export const environment = {
    production: false,
    apiUrl: 'https://kc.mindtechpy.net/admin/realms/LegajoUser',
    serverUrl: 'http://localhost:3000/legajo/api',
    //serverUrl: 'https://back.mindtechpy.net/legajo/legajo/api',
    keycloakConfig: {
        clientId:"cli-legajo-user",
        issuer: 'https://kc.mindtechpy.net/realms/LegajoUser',
        tokenEndpoint: 'https://kc.mindtechpy.net/realms/LegajoUser/protocol/openid-connect/token',
        responseType: 'code',
        scope: 'openid profile',
        showDebugInformation: true,
    }
  };
