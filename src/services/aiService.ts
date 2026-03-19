export interface ThesisContextData {
  studentName: string;
  topic: string;
  university: string;
  degree: string;
  progress: number;
  currentPhase: string;
  kbItems: Array<{ title: string; content: string }>;
}

export async function generateOnaResponse(context: ThesisContextData, history: Array<{ role: string; text: string }>, prompt: string): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, history, prompt })
    });

    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data.response || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Ona is currently experiencing connection issues. Please try again later.";
  }
}

export async function evaluateSupervisorIntercept(context: ThesisContextData, prompt: string): Promise<{ knows_answer: boolean; response: string | null }> {
  try {
    const res = await fetch('/api/intercept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, prompt })
    });

    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    
    return {
      knows_answer: data.knows_answer === true,
      response: data.response || null
    };
  } catch (error) {
    console.error("AI Intercept Error:", error);
    return { knows_answer: false, response: null };
  }
}
