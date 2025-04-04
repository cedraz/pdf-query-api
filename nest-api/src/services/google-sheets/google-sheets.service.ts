/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  constructor(private readonly configService: ConfigService) {}

  async getAuthSheets(): Promise<{
    auth: any;
    client: any;
    googleSheets: any;
    spreadsheetId: string | undefined;
  }> {
    const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');
    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const spreadsheetId = this.configService.get<string>(
      'GOOGLE_SPREADSHEET_ID',
    );

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client as any });

    return {
      auth,
      client,
      googleSheets,
      spreadsheetId,
    };
  }
}
