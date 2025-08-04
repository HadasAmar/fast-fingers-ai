from pydantic import BaseModel

class TypingResult(BaseModel):
    text: str
    typed: str
    duration: float = None  
