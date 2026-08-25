from app.ai.gemini_analyzer import model


def generate_fallback_evaluation(question: str, answer: str) -> str:
    word_count = len(answer.strip().split())
    
    score = 7
    strengths = []
    weaknesses = []
    improvements = []
    
    if word_count > 30:
        score += 1
        strengths.append("Provided a detailed explanation addressing the core topic.")
    else:
        strengths.append("Direct answer to the question.")
        weaknesses.append("Response is brief; consider elaborating with technical depth and real-world examples.")
        improvements.append("Use the STAR (Situation, Task, Action, Result) method to structure behavioral/technical responses.")

    if any(tech in answer.lower() for tech in ["because", "architecture", "scale", "performance", "async", "database", "api", "function"]):
        strengths.append("Used technical terminology appropriately.")
    else:
        improvements.append("Incorporate specific technical terms, mechanisms, and design considerations.")

    score = min(max(score, 4), 9)

    return f"""Score: {score}/10

Strengths:
- {strengths[0]}
{f"- {strengths[1]}" if len(strengths) > 1 else "- Clear communication style."}

Weaknesses:
- {weaknesses[0] if weaknesses else "Could provide deeper operational considerations or trade-offs."}
- Could mention practical use-cases or debugging experiences.

Improvements:
- {improvements[0] if improvements else "Mention edge cases and scalability factors."}
- Quantify impact or performance improvements when sharing experiences.

Ideal Answer:
A comprehensive answer should define the fundamental concept clearly, explain the underlying architecture or mechanism, outline practical advantages and potential trade-offs, and conclude with a concise real-world production example."""


def evaluate_answer(question: str, answer: str):
    if model:
        try:
            prompt = f"""
You are an experienced technical interviewer.

Interview Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return ONLY in this format:

Score: X/10

Strengths:
- ...

Weaknesses:
- ...

Improvements:
- ...

Ideal Answer:
...
"""
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"Gemini evaluation failed, using fallback: {e}")

    return generate_fallback_evaluation(question, answer)