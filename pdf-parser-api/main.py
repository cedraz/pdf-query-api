from fastapi import FastAPI, File, UploadFile, HTTPException
from io import BytesIO
import uvicorn


def lifespan(_):
    print("\n\033[92mAPI Online!\033[0m")
    print(
        "\033[94mDocumentação Swagger disponível em:\033[0m http://localhost:8000/docs\n")
    yield
    print("shutdown")


app = FastAPI(lifespan=lifespan)


@app.post(
    "/process-pdf",
    summary="Converte PDF para texto estruturado",
    description="Recebe um arquivo PDF via upload e retorna o texto processado",
    tags=["Conversão de Documentos"]
)
async def convert_pdf(file: UploadFile = File(..., description="Arquivo PDF para conversão")):
    try:
        texto = 'Nery é um amigao'

        return {
            "filename": file.filename,
            "content": texto
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        access_log=False
    )
