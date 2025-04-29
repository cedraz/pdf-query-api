import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GetPDFInfoDto } from './dto/get-pdf-info.dto';
import OpenAI from 'openai';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LmStudioService {
  private readonly openai: OpenAI;
  private readonly MODEL_NAME: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: this.configService.get('LM_STUDIO_API_URL'),
      apiKey: 'lm-studio',
    });

    this.MODEL_NAME = this.configService.get('MODEL_NAME') as string;
  }

  async getSimulationResult(getPDFInfoDto: GetPDFInfoDto) {
    //     const structuredPrompt = `
    //     [INST]
    //     Você receberá o texto extraído de um PDF. Esse texto pode conter uma tabela com dados, mas o formato não estará explícito, pois os separadores e alinhamentos podem variar.

    //     Sua tarefa é:
    //     1. Analisar o texto e identificar, se existir, uma tabela com linhas e colunas.
    //     2. Organizar os dados em uma estrutura de tabela no formato JSON, onde cada linha é um objeto com chaves representando os nomes das colunas (tente inferir os rótulos se houver cabeçalho) e os respectivos valores.
    //     3. Em seguida, filtre apenas as linhas em que o campo "Quantidade" seja maior que 100.
    //     4. Responda apenas com o JSON resultante.

    //     A seguir, o texto extraído:

    //     [TEXTO_EXTRAÍDO_DO_PDF_AQUI]
    //     [/INST]
    // `;
    //     // const structuredPrompt = `
    //     // ${getPDFInfoDto.doctags}

    //     // Analise esta tabela que está completa e me diga qual a melhor proposta para:

    //     // crédito de até R$ ${getPDFInfoDto.credit}
    //     // valor da parcela de até R$ ${getPDFInfoDto.monthly_fee}

    //     // Instruções estritas:
    //     // 1. Retorne APENAS o JSON no formato solicitado
    //     // 2. Não inclua nenhum texto adicional
    //     // 3. Não use markdown
    //     // 4. Formato obrigatório:

    //     // {
    //     //   "asset": "<preencher com o bem>",
    //     //   "monthly_fee": "<preencher com a mensalidade>"
    //     // }`;

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
