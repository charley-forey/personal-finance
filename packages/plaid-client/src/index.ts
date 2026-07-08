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
  options?: {
    webhookUrl?: string;
    redirectUri?: string;
    products?: Array<'transactions' | 'investments' | 'liabilities'>;
  },
): LinkTokenCreateRequest {
  const productMap = {
    transactions: Products.Transactions,
    investments: Products.Investments,
    liabilities: Products.Liabilities,
  } as const;

  const selected = options?.products?.length
    ? options.products
    : (['transactions', 'investments', 'liabilities'] as const);

  const request: LinkTokenCreateRequest = {
    user: { client_user_id: userId },
    client_name: clientName,
    products: selected.map((p) => productMap[p]),
    country_codes: [CountryCode.Us],
    language: 'en',
  };

  const webhook = options?.webhookUrl?.trim();
  const redirectUri = options?.redirectUri?.trim();
  if (webhook) request.webhook = webhook;
  if (redirectUri) request.redirect_uri = redirectUri;

  return request;
}

export { PlaidApi, Products, CountryCode };
