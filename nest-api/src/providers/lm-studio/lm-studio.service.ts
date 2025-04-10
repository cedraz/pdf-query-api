import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GetPDFInfoDto } from './dto/get-pdf-info.dto';
import OpenAI from 'openai';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

@Injectable()
export class LmStudioService {
  private readonly API_URL = 'http://localhost:1234/v1/';
  private readonly MODEL_NAME = 'deepseek-r1-distill-llama-8b';

  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: this.API_URL,
      apiKey: 'lm-studio',
    });
  }

  async getSimulationResult(getPDFInfoDto: GetPDFInfoDto) {
    const structuredPrompt = `
    ${getPDFInfoDto.doctags}

    Analise esta tabela que está completa e me diga qual a melhor proposta para:

    crédito de até R$ ${getPDFInfoDto.credit}
    valor da parcela de até R$ ${getPDFInfoDto.monthly_fee}

    Instruções estritas:
    1. Retorne APENAS o JSON no formato solicitado
    2. Não inclua nenhum texto adicional
    3. Não use markdown
    4. Formato obrigatório:

    {
      "asset": "<preencher com o bem>",
      "monthly_fee": "<preencher com a mensalidade>"
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: structuredPrompt,
          },
        ],
        temperature: 0.01,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'simulation_response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                asset: {
                  type: 'string',
                },
                monthly_fee: {
                  type: 'string',
                },
              },
              required: ['asset', 'monthly_fee'],
            },
          },
        },
      });

      const parsedResponse =
        (completion.choices[0].message.content ??
        completion.choices[0].message.content)
          ? (JSON.parse(completion.choices[0].message.content) as {
              asset: string;
              monthly_fee: string;
            })
          : { asset: '', monthly_fee: '' };

      return parsedResponse;
    } catch (error: unknown) {
      console.error({
        error: error instanceof Error ? error.message : String(error),
        message: 'Error while processing the request',
        structuredPrompt,
        date: new Date(),
      });

      throw new ServiceUnavailableException(
        ErrorMessagesHelper.AI_SERVICE_UNAVAILABLE,
      );
    }
  }
}
