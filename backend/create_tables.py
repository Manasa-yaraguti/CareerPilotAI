from app.database.database import engine
from app.database.base import Base

# Import all models
import app.models

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully!")