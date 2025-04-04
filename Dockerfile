FROM python:3.10-slim

WORKDIR /app

# Copia o requirements.txt e instala as dependências
COPY ./docling-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código para dentro do container
COPY . .

# Porta que a aplicação irá escutar
EXPOSE 8000

CMD ["uvicorn", "docling-api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

