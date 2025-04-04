import { Injectable } from '@nestjs/common';

type TDoclingResponse = {
  filename: string;
  content: string;
};

@Injectable()
export class DoclingService {
  private doclingApiURL = 'http://localhost:8000';

  async processPDF(buffer: Buffer): Promise<TDoclingResponse> {
    const blob = new Blob([buffer], { type: 'application/pdf' });

    const formData = new FormData();

    formData.append('file', blob, 'document.pdf');

    const response = await fetch(`${this.doclingApiURL}/process-pdf`, {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as TDoclingResponse;

    return data;
  }
}
