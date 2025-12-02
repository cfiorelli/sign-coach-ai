from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from schemas import InferenceRequest, InferenceResponse
from model import model

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/infer-sign", response_model=InferenceResponse)
def infer_sign(request: InferenceRequest):
    result = model.predict(request.target_sign_id, request.features, request.image)
    return result

@app.get("/")
def read_root():
    return {"message": "SignCoach ML Service"}
