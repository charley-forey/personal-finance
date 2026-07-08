import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  LinkTokenCreateRequest,
} from 'plaid';

export interface PlaidConfig {
  clientId: string;
  secret: string;
  env: 'sandbox' | 'development' | 'production';
  webhookUrl?: string;
}

export function createPlaidClient(config: PlaidConfig): PlaidApi {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[config.env],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.clientId,
        'PLAID-SECRET': config.secret,
      },
    },
  });
  return new PlaidApi(configuration);
}

export function buildLinkTokenRequest(
  userId: string,
  clientName: string,
  webhookUrl?: string,
): LinkTokenCreateRequest {
  return {
    user: { client_user_id: userId },
    client_name: clientName,
    products: [Products.Transactions, Products.Investments, Products.Liabilities],
    country_codes: [CountryCode.Us],
    language: 'en',
    webhook: webhookUrl,
  };
}

export { PlaidApi, Products, CountryCode };
