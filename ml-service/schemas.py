from pydantic import BaseModel
from typing import List, Optional, Dict

class InferenceRequest(BaseModel):
    target_sign_id: str
    # In a real app, this would be a base64 string or list of landmarks
    # For MVP, we'll accept a mock "feature vector" or just trigger the mock logic
    features: Optional[List[float]] = None
    image: Optional[str] = None # Base64 encoded image string

class InferenceResponse(BaseModel):
    predicted_sign_id: str
    confidence: float
    is_correct: bool
    feedback: List[str]
    scores: Dict[str, float]
    landmarks: Optional[List[Dict[str, float]]] = None # List of {x, y, z}
