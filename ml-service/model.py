import random

class SignModel:
    def __init__(self):
        # Mock vocabulary
        self.vocabulary = {
            "sign_hello": "Hello",
            "sign_thankyou": "Thank You",
            "sign_A": "A",
            "sign_B": "B",
            # ... add more as needed
        }

    def predict(self, target_sign_id: str, features: list = None, image_b64: str = None):
        """
        Mock prediction logic with real hand detection.
        """
        import mediapipe as mp
        import cv2
        import numpy as np
        import base64

        # Initialize MediaPipe Hands (lazy load or reuse if class attribute)
        if not hasattr(self, 'mp_hands'):
            self.mp_hands = mp.solutions.hands.Hands(
                static_image_mode=True,
                max_num_hands=1,
                min_detection_confidence=0.5
            )

        # If image provided, detect hands
        hand_detected = False
        landmarks_list = []
        
        if image_b64:
            try:
                # Decode base64
                if "," in image_b64:
                    image_b64 = image_b64.split(",")[1]
                image_bytes = base64.b64decode(image_b64)
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if img is not None:
                    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    results = self.mp_hands.process(img_rgb)
                    if results.multi_hand_landmarks:
                        hand_detected = True
                        # Extract landmarks for the first hand
                        for lm in results.multi_hand_landmarks[0].landmark:
                            landmarks_list.append({"x": lm.x, "y": lm.y, "z": lm.z})
            except Exception as e:
                print(f"Error processing image: {e}")

        # Fallback to features check if no image (legacy/testing)
        if not hand_detected and not features:
             return {
                "predicted_sign_id": "none",
                "confidence": 0.0,
                "is_correct": False,
                "feedback": ["Waiting for hand..."],
                "scores": {"handshape": 0, "orientation": 0, "location": 0},
                "landmarks": []
            }

        # Deterministic mock for demo:
        # If target is "Hello", always succeed for now to let user feel good
        # If target is "A", fail to show feedback
        
        is_correct = True
        if target_sign_id == "A": 
             is_correct = False
        
        # Randomize slightly to feel "live" but keep state consistent-ish
        confidence = random.uniform(0.85, 0.99) if is_correct else random.uniform(0.3, 0.5)
        
        feedback = []
        if not is_correct:
            feedback = [
                "Try rotating your wrist.",
                "Check your hand shape."
            ]
        else:
            feedback = ["Great job!", "Perfect form."]

        return {
            "predicted_sign_id": target_sign_id if is_correct else "unknown",
            "confidence": confidence,
            "is_correct": is_correct,
            "feedback": feedback,
            "scores": {
                "handshape": 0.9 if is_correct else 0.4,
                "orientation": 0.9 if is_correct else 0.4,
                "location": 0.9 if is_correct else 0.4,
            },
            "landmarks": landmarks_list
        }

model = SignModel()
