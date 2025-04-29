# PDF Query API

## Nesse README

- [Para rodar a API](#para-rodar-a-api)
- [Banco de dados](#banco-de-dados)
- [Docker e Hospedagem](#docker-e-hospedagem)
  - [Docker](#docker)
  - [Tunnel Cloudflare](#tunnel-cloudflare)
- [Autenticação e Permissionamento](#autenticação-e-permissionamento)
- [Ferramentas da API](#ferramentas-da-api)
  - [Swagger](#swagger)
  - [Interceptors e Pipes](#interceptors-e-pipes)
- [Explicando algumas pastas](#explicando-algumas-pastas)
  - [Pasta Common](#pasta-common)
  - [Pasta Helpers](#pasta-helpers)
  - [Jobs](#jobs)
- [Testes](#testes)

## Incompleto

1. [x] API em Nest com autenticação e sistema multi tenancy
2. [x] Docker com serviços do Postgresql, Redis e MongoDB
3. [x] Serviço do LMStudio para leitura dos dados do PDF
4. [x] API em FastAPI com a biblioteca [Docling](https://github.com/docling-project/docling)
5. [ ] Simplificar permissionamento
6. [ ] Serviço para salvar resultados do prompt no Redis
7. [ ] Serviço para salvar conteúdo do PDF no MongoDB
8. [ ] Serviço da API python no Docker Compose
9. [ ] Configuração de testes e2e

## Docker e Bancos de dados

### Docker

O Docker inicia o banco de dados Postgresql, o banco Redis para cache e para as filas e o banco MongoDB.

Para iniciar o docker, basta executar o seguinte comando:

```bash
docker compose up
```

### Bancos de dados

Toda o esquema do banco é gerado através do Prisma, para gerar a migration e aplicar o esquema no banco, basta executar o seguinte comando:

**Para desenvolvimento**

```bash
npx prisma migrate dev
```

**Para produção**

```bash
npx prisma migrate deploy
```

Para visualizar, criar, deletar e editar os dados em uma interface gráfica amigável, basta executar o seguinte comando:

```bash
npx prisma studio
```

Nesse template o esquema do banco será bem simples, apenas para demonstrar como esquematizar o banco e como os dados são estruturados.

## Para rodar a API Python

Primeiramente é necessário instalar as dependências do projeto, para isso va até a pasta "pdf-parser-api" e execute o seguinte comando:

Abra o ambiente virtual python, caso ele não exista:

```bash
python3 -m venv venv
```

Ative o ambiente virtual:
```bash
source venv/bin/activate
```

Instale as dependências do projeto:

```bash
pip install -r requirements.txt
```

Para rodar a API execute no terminal:

```bash
uvicorn main:app --reload
```

Caso deseje sair do ambiente virtual execute:

```bash
deactivate
```

Demais comandos se encontram no arquivo `package.json` na parte "scripts".

**se precisar utilize o comando sudo**

## Para rodar a API Node

Primeiramente é necessário instalar as dependências do projeto, para isso va até a pasta "nest-api" e execute o seguinte comando:

```bash
npm install
```

**O Template foi criado utilizando a versão 22.14.0, ao tentar instalar as dependências com versões abaixo dessa pode ocorrer erros.**

Após instalada as dependências, basta executar o seguinte comando:

```bash
npm run start:dev
```

Para buildar a aplicação, basta executar o seguinte comando:

```bash
npm run build
```

Demais comandos se encontram no arquivo `package.json` na parte "scripts".

**se precisar utilize o comando sudo**

## Modelo de IA

Para este projeto eu utilizei o LMStudio e rodei localmente o modelo "deepseek-r1-distill-llama-8b" utilizando também a própria função de criar uma API, permitindo assim que eu conseguisse enviar requisições para o modelo através do endpoint gerado pelo próprio LMStudio.

Para fazer isso basta baixar o [LMStudio](https://lmstudio.ai/)

Procurar o modelo mencionado e baixá-lo

Após isso basta iniciar o modelo, ir na sessão "Developer" e clicar em "Start Server" no canto superior esquerdo, ou apenas dar "ctrl + .".

Feito isso a URL da API irá aparecer no canto direito do aplicativo.

Você pode habilitar o "Verbose Logging" da aplicação e também configurar o modelo para receber mais ou menos tokens (se atentar as especificações da sua máquina)

## Cargos e permissionamento

Por ser uma aplicação multi-tenancy, nessa API é permitido a criação de _cargos_ e _módulos_

Dessa forma cada _organização_ é capaz de criar os cargos que desejar (além dos previamente cadastrados) e definir as permissões que cada cargo terá. Esse permissionamento pode ser customizado a nível de _módulos_ ou _entidades_ da aplicação, podendo definir se é possível "ler", "criar", "atualizar", "deletar", ou qualquer outra ação naquela determinada funcionalidade da aplicação.

## Ferramentas da API

### Swagger

Documentação automizada, basta seguir a lógica utilizada nos DTOs e nos controllers para poder tipar e validar os dados e visualizar corretamente eles no Swagger UI no navegador. Para ver a documentação basta acessar a rota `/docs`

### Interceptors e Pipes

```typescript
app.useGlobalInterceptors(new PrismaErrorsInterceptor());
app.useGlobalPipes(new ValidationPipe());
```

O `PrismaErrorsInterceptor` é um interceptor que captura os erros do Prisma e os transforma em erros mais amigáveis para o usuário.

O `ValidationPipe` é um pipe que valida os dados que estão sendo enviados para a aplicação, ele utiliza os decorators de validação do class-validator. Sem ele toda a lógica de paginação e filtragem não irá funcionar corretamente.

## Explicando algumas pastas

### Pasta Common

Nessa pasta estão alguns arquivos utilizados em vários lugares da aplicação, principalmente dtos, entities e decorators

Foram criados decorators para validação de CPF e CNPJ, pode-se utilizar essas funções de exemplo para criar seus próprios decorators.

### Pasta Helpers

Nessa pasta está apenas um arquivo .helper que serve como tradução de alguns erros na aplicação.

### Jobs

Nessa pasta se encontra toda a lógica das filas e as filas criadas, isso inclui envio de email através do BullMQ e uma função para limpar os "verification_requests" que já foram utilizados ou que estão expirados.

## Testes

Nessa template de API foram criados apenas alguns testes de integração (end to end ou e2e). Também foi criado um ambiente de testes que, quando executado, cria um schema do banco de dados (sub-banco vazio) para testar apenas aquele bloco de testes (bloco de testes = arquivo de teste), após finalizado os testes todos os schemas que não são o schema principal (public) são deletados.

Os testes se encontram na pasta da sua respectiva entidade/feature, no caso deste template se encontra na pasta "src/user", no arquivo "user.e2e-spac.ts".

Qualquer arquivo de teste, para que rode corretamente, precisa ter a terminação ".e2e-spec.ts".

Para rodar os testes basta executar o seguinte comando:

```bash
npm run test:e2e
```

Para rodar os testes em modo watch basta executar o seguinte comando:

```bash
npm run test:e2e:watch
```

## Tunnel Cloudflare

Para abrir um tunnel para a aplicação e poder acessar a API de qualquer lugar com HTTPS, basta executar o seguinte comando:

```bash
cloudflared tunnel --url http://localhost:3000
```

** É necessário ter o cloudflared baixado na máquina **

** Lembre-se de substituir o `3000` pela porta que a aplicação está rodando. **
