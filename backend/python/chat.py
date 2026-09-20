import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)

conversation = [
    {
        "role": "system",
        "content": """You are the helpful AI assistant for WoodWork Creations, a family-owned carpentry business.
Answer questions warmly and honestly. Do not invent prices, inventory, delivery promises, or policies.
If you do not know something, say so and suggest contacting the business directly."""
    }
]

questions = ["What is the capital of France?"]

for question in questions:
    conversation.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model="meta-llama/Llama-3.1-8B-Instruct:novita",
        messages=conversation,
        max_tokens=100,
        temperature=0.2,
    )

    response_content = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": response_content})
    print(response_content)
