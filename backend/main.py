from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os

app = FastAPI(title="GameXBuddy Backend", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://gamexbuddy.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI setup (add to env later)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Data Models
class User(BaseModel):
    id: str
    email: str
    points: int = 0

class EarningActivity(BaseModel):
    user_id: str
    activity_type: str  # download, surf, community, newsletter
    points_earned: int
    metadata: Optional[dict] = None

class DownloadRequest(BaseModel):
    user_id: str
    file_url: str
    file_name: str

# Mock user database (replace with Supabase integration later)
users_db = {}
earning_activities = []

# Earning Modules

@app.post("/api/earning/download")
async def earn_from_download(request: DownloadRequest):
    """Earn points from file downloads"""
    # Award points for download engagement
    points = 50  # Base points for downloads

    # Record earning activity
    activity = EarningActivity(
        user_id=request.user_id,
        activity_type="download",
        points_earned=points,
        metadata={"file_name": request.file_name, "file_url": request.file_url}
    )

    earning_activities.append(activity)

    # Update user points (in real app, update Supabase)
    if request.user_id not in users_db:
        users_db[request.user_id] = User(id=request.user_id, email="", points=0)

    users_db[request.user_id].points += points

    return {
        "success": True,
        "points_earned": points,
        "total_points": users_db[request.user_id].points,
        "activity": activity.dict()
    }

@app.post("/api/earning/surf")
async def earn_from_surf(user_id: str):
    """Earn points from page/file surfing"""
    points = 10  # Points per page view or interaction

    activity = EarningActivity(
        user_id=user_id,
        activity_type="surf",
        points_earned=points,
        metadata={"action": "page_interaction"}
    )

    earning_activities.append(activity)

    if user_id not in users_db:
        users_db[user_id] = User(id=user_id, email="", points=0)

    users_db[user_id].points += points

    return {
        "success": True,
        "points_earned": points,
        "total_points": users_db[user_id].points,
        "activity": activity.dict()
    }

@app.post("/api/earning/community")
async def earn_from_community(user_id: str, activity_type: str):
    """Earn points from community interactions"""
    point_values = {
        "post": 25,
        "comment": 10,
        "like": 5,
        "share": 15
    }

    points = point_values.get(activity_type, 5)

    activity = EarningActivity(
        user_id=user_id,
        activity_type="community",
        points_earned=points,
        metadata={"interaction_type": activity_type}
    )

    earning_activities.append(activity)

    if user_id not in users_db:
        users_db[user_id] = User(id=user_id, email="", points=0)

    users_db[user_id].points += points

    return {
        "success": True,
        "points_earned": points,
        "total_points": users_db[user_id].points,
        "activity": activity.dict()
    }

@app.post("/api/earning/newsletter")
async def earn_from_newsletter(user_id: str):
    """Earn points from newsletter subscription/engagement"""
    points = 30  # Points for newsletter engagement

    activity = EarningActivity(
        user_id=user_id,
        activity_type="newsletter",
        points_earned=points,
        metadata={"action": "subscribe_confirm"}
    )

    earning_activities.append(activity)

    if user_id not in users_db:
        users_db[user_id] = User(id=user_id, email="", points=0)

    users_db[user_id].points += points

    return {
        "success": True,
        "points_earned": points,
        "total_points": users_db[user_id].points,
        "activity": activity.dict()
    }

@app.get("/api/earning/leaderboard")
async def get_earnings_leaderboard():
    """Get top earners"""
    sorted_users = sorted(
        [(u.id, u.points) for u in users_db.values()],
        key=lambda x: x[1],
        reverse=True
    )[:10]  # Top 10

    return {"leaderboard": sorted_users}

@app.get("/api/earning/user/{user_id}")
async def get_user_earnings(user_id: str):
    """Get user's earning history"""
    user_activities = [a for a in earning_activities if a.user_id == user_id]

    total_points = sum(a.points_earned for a in user_activities) if user_activities else 0

    return {
        "total_points": total_points,
        "activities": [a.dict() for a in user_activities]
    }

# AI Integration Routes

class ContentGenerationRequest(BaseModel):
    prompt: str
    content_type: str  # guide, summary, social_post
    user_id: str

@app.post("/api/ai/generate-content")
async def generate_ai_content(request: ContentGenerationRequest):
    """Generate content using AI"""
    try:
        system_prompts = {
            "guide": "You are a gaming expert. Create an engaging, helpful guide for gamers.",
            "summary": "Create a concise, engaging summary for gaming content.",
            "social_post": "Create an exciting social media post about gaming."
        }

        system_prompt = system_prompts.get(request.content_type, "You are a helpful gaming assistant.")

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=500
        )

        generated_content = response.choices[0].message.content

        # Award points for AI interaction
        await earn_from_surf(request.user_id)

        return {
            "success": True,
            "content": generated_content,
            "content_type": request.content_type,
            "tokens_used": response.usage.total_tokens
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "gamexbuddy-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)