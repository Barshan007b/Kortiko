from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    category: str
    subcategory: Optional[str] = None
    dietary_type: Optional[str] = None
    is_featured: bool = False

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemBase]

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    priority: int
    created_at: datetime
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    intent: str # food, grocery, both, general
    suggestions: List[Product] = []

class ContactCreate(BaseModel):
    name: str
    email: str
    message: str
