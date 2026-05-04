from typing import List, Dict
import random

class AIConcierge:
    def __init__(self, products: List[Dict]):
        self.products = products

    def process_message(self, message: str) -> Dict:
        msg = message.lower()
        intent = "general"
        response = ""
        suggestions = []

        # Intent classification
        if any(word in msg for word in ["dinner", "lunch", "breakfast", "meal", "eat", "chef", "biryani", "kebab", "desi"]):
            intent = "food"
            if "dinner" in msg:
                response = "I can suggest some exquisite gourmet dinners. Our Saffron Infused Dum Biryani is a royal choice for tonight."
            elif "breakfast" in msg:
                response = "A refined Indian breakfast is a great start. Perhaps some Truffle Malai Broccoli for a modern twist?"
            elif "biryani" in msg:
                response = "Ah, the fragrance of royal spices. Our Awadhi Biryani is truly exceptional."
            else:
                response = "Our culinary curation celebrates the richness of Indian flavors with a modern luxury touch. Here are some recommendations."
            
            suggestions = [p for p in self.products if p.get("category") == "Food"][:3]

        elif any(word in msg for word in ["ingredients", "grocery", "shop", "vegetables", "fruit", "milk", "mango", "saffron", "ghee"]):
            intent = "grocery"
            if "mango" in msg:
                response = "Our A+ Grade Alphonso Mangoes from Devgad are currently at the peak of their season. A true treat for the senses."
            elif "saffron" in msg:
                response = "We source the purest Mogra Saffron from Pampore, Kashmir. It's the gold standard for your pantry."
            else:
                response = "From Araku Coffee to Gir Cow Ghee, we've curated India's finest lifestyle essentials for your home."
            suggestions = [p for p in self.products if p.get("category") == "Grocery"][:3]

        elif any(word in msg for word in ["healthy", "wellness", "organic", "ayurveda"]):
            intent = "both"
            response = "We believe in the heritage of Indian wellness. Our selection includes nutrient-dense A2 Ghee and organic seasonal produce."
            suggestions = [p for p in self.products if "organic" in p.get("name", "").lower() or "wellness" in p.get("description", "").lower() or "ghee" in p.get("name", "").lower()][:3]

        else:
            response = "Welcome to Kortiko. I am your AI Concierge. How may I assist your curated lifestyle today? You can ask about gourmet meals or artisanal groceries."
            suggestions = [p for p in self.products if p.get("is_featured")][:3]

        return {
            "response": response,
            "intent": intent,
            "suggestions": suggestions
        }
