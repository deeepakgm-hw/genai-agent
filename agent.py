import random

def career_agent(user_input):
    # Predefined realistic responses
    responses = [
        f"""
        1. Confidence Feedback:
        You show moderate confidence but can improve clarity.

        2. Strengths:
        - Good understanding of the topic
        - Logical explanation

        3. Weaknesses:
        - Slight hesitation
        - Needs better structure

        4. Improved Answer:
        "I am confident in my coding skills, and I continuously improve by practicing real-world problems. I am also working on improving my communication skills."

        5. Final Score: {random.randint(6, 8)}/10
        """,

        f"""
        1. Confidence Feedback:
        Your answer is decent but lacks impact.

        2. Strengths:
        - Clear intent
        - Basic understanding

        3. Weaknesses:
        - Not detailed enough
        - Needs examples

        4. Improved Answer:
        "I have strong coding skills backed by hands-on projects. I am actively improving my communication by participating in presentations and teamwork."

        5. Final Score: {random.randint(5, 7)}/10
        """,

        f"""
        1. Confidence Feedback:
        Strong answer with good confidence.

        2. Strengths:
        - Well structured
        - Clear communication

        3. Weaknesses:
        - Could add real examples

        4. Improved Answer:
        "I combine strong technical skills with continuous learning and practical project experience. I am also actively working on improving my communication for interviews."

        5. Final Score: {random.randint(7, 9)}/10
        """
    ]

    return random.choice(responses)
