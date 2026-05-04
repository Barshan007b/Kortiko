from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os

from . import models, schemas, database, ai_engine
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kortiko API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Frontend Assets
app.mount("/styles", StaticFiles(directory="frontend/styles"), name="styles")
app.mount("/js", StaticFiles(directory="frontend/js"), name="js")
app.mount("/assets", StaticFiles(directory="frontend/assets"), name="assets")

@app.get("/")
async def read_index():
    from fastapi.responses import FileResponse
    return FileResponse(os.path.join("frontend", "index.html"))

@app.get("/{page}.html")
async def read_html_page(page: str):
    from fastapi.responses import FileResponse
    file_path = os.path.join("frontend", f"{page}.html")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Page not found")

@app.get("/products", response_model=List[schemas.Product])
def get_products(category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/orders", response_model=schemas.Order)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Simulate a user (Hardcoded for demo)
    user = db.query(models.User).first()
    if not user:
        user = models.User(email="demo@kortiko.in", full_name="Arjun Malhotra", priority_tier="Elite")
        db.add(user)
        db.commit()
        db.refresh(user)

    total_amount = 0
    order = models.Order(
        user_id=user.id,
        status="Pending",
        priority=1 if user.priority_tier == "Elite" else (2 if user.priority_tier == "Preferred" else 3)
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            order_item = models.OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price_at_purchase=product.price
            )
            total_amount += product.price * item.quantity
            db.add(order_item)
    
    order.total_amount = total_amount
    db.commit()
    db.refresh(order)
    return order

@app.post("/chat", response_model=schemas.ChatResponse)
def chat_with_concierge(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    # Convert ORM to dict for AI engine
    product_list = [
        {"id": p.id, "name": p.name, "description": p.description, "category": p.category, "is_featured": p.is_featured} 
        for p in products
    ]
    ai = ai_engine.AIConcierge(product_list)
    result = ai.process_message(request.message)
    
    # Return actual product objects for suggestions
    suggestion_ids = [p["id"] for p in result["suggestions"]]
    actual_suggestions = db.query(models.Product).filter(models.Product.id.in_(suggestion_ids)).all()
    
    return {
        "response": result["response"],
        "intent": result["intent"],
        "suggestions": actual_suggestions
    }

@app.post("/contact-submit")
def submit_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    return {"message": "Thank you for reaching out. Our concierge will contact you shortly."}

@app.post("/process-payment")
def process_payment():
    # Simulate payment delay
    import time
    time.sleep(1)
    return {"status": "success", "transaction_id": "KRT-123456789"}
