from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

def seed():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if products already exist
    if db.query(models.Product).first():
        print("Database already seeded.")
        return

    products = [
        # FOOD (Immediate Consumption) - Indian Gourmet
        models.Product(
            name="Saffron Infused Dum Biryani",
            description="Long-grain Basmati rice layered with premium Kashmiri saffron and tender slow-cooked meat. A royal Awadhi classic.",
            price=1250.0,
            image_url="https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800",
            category="Food",
            subcategory="Chef Specials",
            dietary_type="Non-Veg",
            is_featured=True
        ),
        models.Product(
            name="Truffle Malai Broccoli",
            description="Charcoal-grilled broccoli florets marinated in a creamy truffle-infused malai and cardamom. A modern Indian twist.",
            price=650.0,
            image_url="https://images.unsplash.com/photo-1589670307596-a176756b8df7?w=800",
            category="Food",
            subcategory="Gourmet Meals",
            dietary_type="Veg",
            is_featured=True
        ),
        models.Product(
            name="Jackfruit Galouti Kebab",
            description="Melt-in-the-mouth kebabs made from tender jackfruit and secret Nawabi spices. Served with Ulta Tawa Paratha.",
            price=550.0,
            image_url="https://images.unsplash.com/photo-1601050633729-1954840b05b4?w=800",
            category="Food",
            subcategory="Starters",
            dietary_type="Veg"
        ),
        
        # GROCERY (Lifestyle Essentials) - Indian Origin
        models.Product(
            name="A+ Grade Alphonso Mangoes",
            description="Directly sourced from Devgad. The 'King of Mangoes' known for its creamy texture and unique aroma.",
            price=1800.0,
            image_url="https://images.unsplash.com/photo-1553279768-865429fa0078?w=800",
            category="Grocery",
            subcategory="Seasonal Fruit",
            dietary_type="Veg",
            is_featured=True
        ),
        models.Product(
            name="Kashmiri Mogra Saffron (1g)",
            description="Highest grade Mogra saffron from the fields of Pampore. Intense color and therapeutic aroma.",
            price=450.0,
            image_url="https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?w=800",
            category="Grocery",
            subcategory="Pantry",
            dietary_type="Veg",
            is_featured=True
        ),
        models.Product(
            name="Single-Origin Araku Valley Coffee",
            description="Award-winning specialty coffee from the tribal growers of Araku Valley. Notes of chocolate and citrus.",
            price=850.0,
            image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
            category="Grocery",
            subcategory="Beverages",
            dietary_type="Veg"
        ),
        models.Product(
            name="Cold-Pressed A2 Gir Cow Ghee",
            description="Traditional Bilona method ghee made from the milk of grass-fed Gir cows. Rich in nutrients.",
            price=1500.0,
            image_url="https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800",
            category="Grocery",
            subcategory="Wellness Products",
            dietary_type="Veg"
        )
    ]
    
    db.add_all(products)
    
    # Add a demo user
    user = models.User(
        email="client@kortiko.in",
        full_name="Arjun Malhotra",
        hashed_password="hashed_password", 
        priority_tier="Elite",
        rfm_score=9.8
    )
    db.add(user)
    
    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
