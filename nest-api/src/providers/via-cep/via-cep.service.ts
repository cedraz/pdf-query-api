import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TViaCepErrorResponse, TViaCepResponse } from './via-cep.types';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { ViaCepEntity } from './entity/via-cep.entity';

@Injectable()
export class ViaCepService {
  async getAddressByCep(cep: string): Promise<any> {
    const request = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!request.ok) {
      throw new ServiceUnavailableException(
        ErrorMessagesHelper.serviceUnavailableException('ViaCep'),
      );
    }

    const data = (await request.json()) as
      | TViaCepResponse
      | TViaCepErrorResponse;

    if ('erro' in data && data.erro) {
      throw new ServiceUnavailableException(
        ErrorMessagesHelper.serviceUnavailableException('ViaCep'),
      );
    }

    const addressData = data as TViaCepResponse;

    const address: ViaCepEntity = {
      address_line: addressData.logradouro,
      address_number:
        addressData.complemento.length > 0 ? addressData.complemento : null,
      city: addressData.localidade,
      neighborhood: addressData.bairro,
      postal_code: addressData.cep.replace('-', ''),
      state: addressData.estado,
    };

    return address;
  }
}
