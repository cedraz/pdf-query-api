import { Injectable } from '@nestjs/common';
import { LMStudioResponse } from './lm-studio.types';
import { GetPDFInfoDto } from './dto/get-pdf-info.dto';

@Injectable()
export class LmStudioService {
  private readonly API_URL = 'http://localhost:1234/v1/chat/completions';
  private readonly MODEL_NAME = 'deepseek-r1-distill-llama-8b';

  async getSimulationResult(getPDFInfoDto: GetPDFInfoDto) {
    // const filters = {
    //   type: 'Imóvel',
    //   minCredit: 160000,
    //   maxMonthlyPrice: 1900,
    //   expireDate: '18/04/2024',
    // };

    // const structuredPrompt = `Analise esta tabela de consórcio considerando:
    // 1. Identifique todas as linhas e colunas da tabela
    // 2. Converta os valores numéricos para formato JSON (ex: 1.1677,3 → 11677.3)
    // 3. Filtre as opções onde:
    //    - Tipo = ${filters.type}
    //    - Valor do crédito ≥ ${filters.minCredit}
    //    - Valor da parcela ≤ ${filters.maxMonthlyPrice}
    //    - Data de vencimento ≥ ${filters.expireDate}
    // 4. Ordene por menor valor de parcela
    // 5. Retorne apenas os 3 melhores resultados em JSON`;

    const structuredPrompt = `
    ${getPDFInfoDto.doctags}

    Analise esta tabela que está completa e me diga qual a melhor proposta para:

    credito de até R$ ${getPDFInfoDto.credit}
    valor da parcela de até R$ ${getPDFInfoDto.monthly_fee}

    Eu quero a resposta no seguinte formato e apenas nesse formato:

    {
      "asset": "<preencher com o bem>",
      "monthly_fee": "<preencher com a mensalidade"
    }
    `;

    const payload = {
      model: this.MODEL_NAME, // Nome exato do modelo carregado
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: structuredPrompt,
            },
          ],
        },
      ],
      temperature: 0.01, // Reduz aleatoriedade
      max_tokens: 800, // Limita a resposta
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as LMStudioResponse;

    const content = {
      result: data.choices[0].message.content,
    };

    console.log(content);

    return {
      message: data.choices[0].message.content,
    };
  }
}
