import openai

# Set your API key
openai.api_key = ""

def chat_with_chatgpt(prompt, model="gpt-4"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        temperature=0.5,
    )
    message = response['choices'][0]['message']['content'].strip()
    return message


while (1):
    # Your user prompt
    user_prompt = input("-----ASK GPT 4 ANYTHING --------")
    chatbot_response = chat_with_chatgpt(user_prompt)
    print(chatbot_response)

    exit_button = int(input("Press 1 to exit: "))
    if(exit_button):
        break

