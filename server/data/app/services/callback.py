from langchain.callbacks.base import AsyncCallbackHandler
import asyncio

class SSECallbackHandler(AsyncCallbackHandler):
    def __init__(self, queue: asyncio.Queue):
        self.queue = queue

    async def on_llm_new_token(self, token: str, **kwargs):
        await self.queue.put({"type": "token", "token": token})

    async def on_chat_model_end(self, response, **kwargs):
        await self.queue.put({"type": "stage_end", "stage": "final"})

    async def on_llm_end(self, response, **kwargs):
        await self.queue.put(None)
