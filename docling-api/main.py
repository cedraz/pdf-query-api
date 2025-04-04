from fastapi import FastAPI, File, UploadFile, HTTPException
from docling.document_converter import DocumentConverter
from io import BytesIO
from docling.datamodel.base_models import DocumentStream
from docling.exceptions import ConversionError
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
    converter = DocumentConverter()
    try:
        pdf_buffer = await file.read()
        pdf_stream = DocumentStream(
            name=file.filename,
            stream=BytesIO(pdf_buffer),
            mime_type=file.content_type
        )

        result = converter.convert(pdf_stream)

        return {
            "filename": file.filename,
            "content": result.document.export_to_doctags()
        }

    except ConversionError as e:
        raise HTTPException(status_code=400, detail=str(e))
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
