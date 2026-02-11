from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import hashlib

load_dotenv()

app = FastAPI(title="Portfolio Visitor Tracker API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "portfolio_db")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
visitors_collection = db["visitors"]
stats_collection = db["stats"]

# Initialize stats if not exists
def init_stats():
    if stats_collection.count_documents({"type": "global"}) == 0:
        stats_collection.insert_one({
            "type": "global",
            "total_visits": 0,
            "unique_visitors": 0,
            "page_views": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        })

init_stats()

def get_visitor_hash(request: Request):
    """Generate a hash from IP and user agent for unique visitor tracking"""
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    raw = f"{ip}:{user_agent}"
    return hashlib.md5(raw.encode()).hexdigest()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/visitors/track")
async def track_visitor(request: Request):
    """Track a visitor and return updated stats"""
    visitor_hash = get_visitor_hash(request)
    now = datetime.now(timezone.utc).isoformat()
    
    # Check if this is a unique visitor
    existing_visitor = visitors_collection.find_one({"hash": visitor_hash})
    
    is_new_visitor = existing_visitor is None
    
    if is_new_visitor:
        # New unique visitor
        visitors_collection.insert_one({
            "hash": visitor_hash,
            "first_visit": now,
            "last_visit": now,
            "visit_count": 1
        })
        stats_collection.update_one(
            {"type": "global"},
            {
                "$inc": {
                    "total_visits": 1,
                    "unique_visitors": 1,
                    "page_views": 1
                }
            }
        )
    else:
        # Returning visitor
        visitors_collection.update_one(
            {"hash": visitor_hash},
            {
                "$set": {"last_visit": now},
                "$inc": {"visit_count": 1}
            }
        )
        stats_collection.update_one(
            {"type": "global"},
            {"$inc": {"total_visits": 1, "page_views": 1}}
        )
    
    # Get updated stats
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    
    return {
        "success": True,
        "is_new_visitor": is_new_visitor,
        "stats": stats
    }

@app.get("/api/visitors/stats")
async def get_stats():
    """Get visitor statistics"""
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    if not stats:
        return {
            "total_visits": 0,
            "unique_visitors": 0,
            "page_views": 0
        }
    return stats

@app.post("/api/visitors/pageview")
async def track_pageview():
    """Track a page view"""
    stats_collection.update_one(
        {"type": "global"},
        {"$inc": {"page_views": 1}}
    )
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    return {"success": True, "stats": stats}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
