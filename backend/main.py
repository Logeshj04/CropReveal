from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agri_routes import router as agri_router

app = FastAPI(title="Crop Disease Detection & Agri Chatbot")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(agri_router, prefix="/api/agri", tags=["Agri Assistant"])

@app.get("/")
async def root():
    return {"message": "TNAU Agri Chatbot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running successfully"}
