import { NextResponse } from 'next/server';
import {
  getAPIUrl,
  getBackendUrl,
  LEARNHOUSE_DOMAIN,
  LEARNHOUSE_TOP_DOMAIN,
  LEARNHOUSE_HTTP_PROTOCOL,
  isMultiOrgModeEnabled,
  getDefaultOrg
} from '@services/config/config';

export async function GET() {
  return NextResponse.json({
    raw_env: {
      NEXT_PUBLIC_LEARNHOUSE_API_URL: process.env.NEXT_PUBLIC_LEARNHOUSE_API_URL,
      NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL: process.env.NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL,
      NEXT_PUBLIC_LEARNHOUSE_DOMAIN: process.env.NEXT_PUBLIC_LEARNHOUSE_DOMAIN,
      NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN: process.env.NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN,
      NEXT_PUBLIC_LEARNHOUSE_HTTPS: process.env.NEXT_PUBLIC_LEARNHOUSE_HTTPS,
      NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG: process.env.NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG,
      NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG: process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG,
    },
    processed_config: {
      apiUrl: getAPIUrl(),
      backendUrl: getBackendUrl(),
      domain: LEARNHOUSE_DOMAIN,
      topDomain: LEARNHOUSE_TOP_DOMAIN,
      httpProtocol: LEARNHOUSE_HTTP_PROTOCOL,
      multiOrgEnabled: isMultiOrgModeEnabled(),
      defaultOrg: getDefaultOrg(),
    }
  });
}
