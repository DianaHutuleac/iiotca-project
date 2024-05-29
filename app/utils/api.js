// api.js
// Function to fetch book description from the API
export async function fetchBookDescription(bookTitle) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const apiUrl = `https://api.openai.com/v1/engines/davinci/completions/`;
  
    /*
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "prompt": `Generate a book description for the book titled "${bookTitle}".`,  
        "max_tokens": 100, // Adjust token count as needed
      }),
    });
  
    console.log(response)
    
    if (!response.ok) {
      throw new Error('Failed to fetch book description');
    }
  
    const data = await response.json();
    return data.choices[0].text.trim(); // Extract generated text from API response */

    console.log("test3")

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": `Generate a book description for the book titled "${bookTitle}".`}],
          }),
        })
  
        const json = await response.json();  
        console.log("this is the result", json.choices[0].message.content)
        return json.choices[0].message.content
      } catch (error) {
        console.error("this is the result", error); 
      }
     
      
  }
  