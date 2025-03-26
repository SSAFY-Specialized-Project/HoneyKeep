from fastapi import FastAPI
import uvicorn
import config

Config = config.get_config()
app = FastAPI()

@app.get("/")
async def main():
    return {}

if __name__ == "__main__":
    uvicorn.run("main:app", host=Config.HOST, port=Config.PORT, reload=True)
