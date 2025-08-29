from fastapi import APIRouter, UploadFile, File, Form
from services.disease_prediction import predict_label
from services.llm_query import get_disease_info, ask_general_agri_question
import tempfile
import shutil

router = APIRouter()

@router.post("/predict")
async def predict_crop_disease(
    image: UploadFile = File(...),
    language: str = Form("English"),
    followup_question: str = Form(None)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        shutil.copyfileobj(image.file, temp_file)
        temp_path = temp_file.name

    predicted_label, confidence = predict_label(temp_path)
    llm_response = get_disease_info(predicted_label, language, followup_question)

    return {
        "predicted_label": predicted_label,
        "confidence": float(round(confidence * 100, 2)),  # Returns percentage (0-100)
        "llm_response": llm_response
    }

@router.post("/chat")
async def chat_with_llm(query: str = Form(...), language: str = Form("English")):
    response = ask_general_agri_question(query, language)
    return {"response": response}
