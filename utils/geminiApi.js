export async function callGemini(prompt, setLoading, setResult, setError) {
    setLoading(true);
    setResult('');
    setError('');

    // This now reads the API key from your .env.local file
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        setError("Gemini API key not found. Please add it to your .env.local file.");
        setLoading(false);
        return;
    }

    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Invalid response structure from Gemini API.");
        setResult(text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
