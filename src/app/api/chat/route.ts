import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '../../prompt';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Use local Ollama for development, fallback for production
    const isProduction = process.env.NODE_ENV === 'production';
    
    let response;
    if (isProduction) {
      response = await handleFallback(messages);
    } else {
      response = await handleLocalOllama(messages);
    }

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

async function handleLocalOllama(messages: Message[]) {
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  
  const prompt = `${SYSTEM_PROMPT}

User: ${lastUserMessage}
Assistant:`;

  console.log('Using Ollama for history roleplay assistant');
  console.log('User message:', lastUserMessage);

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemma3n:e2b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Ollama API error:', errorData);
    console.error('Response status:', response.status);
    
    throw new Error(`Failed to get response from Ollama. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Ollama Response:', data);
  
  const assistantMessage = data.response || 'I apologize, but I am unable to respond at the moment.';

  return { message: assistantMessage };
}

async function handleFallback(messages: Message[]) {
  const userMessage = messages[messages.length - 1]?.content || '';
  
  // Create immersive NCERT history roleplay responses
  let response = '';
  
  if (userMessage.toLowerCase().includes('mauryan') || userMessage.toLowerCase().includes('chandragupta')) {
    response = `🏛️ **Welcome to the Mauryan Empire Adventure!**

You are a young merchant in **Pataliputra, 322 BCE**. The city buzzes with excitement - word has spread that a new king, **Chandragupta Maurya**, has just been crowned after defeating the Nanda dynasty!

As you walk through the bustling streets, you see:
- **Royal messengers** announcing the new king's policies
- **Merchants** discussing how the new empire will affect trade
- **Soldiers** in Mauryan armor patrolling the streets
- **Scholars** heading to the royal court to serve the new administration

Your family's **spice trade** depends on the new ruler's policies. You've been invited to the grand coronation ceremony at the royal palace, where you'll witness history in the making!

**What would you like to do?**
1. **Attend the coronation ceremony** and witness Chandragupta's rise to power
2. **Visit the royal court** to understand the new administration's policies
3. **Explore the city** to see how Pataliputra is changing under the new empire
4. **Meet with other merchants** to discuss trade opportunities

Choose your path and let's explore the **Golden Age of the Mauryan Empire** together! 🏺`;
  } else if (userMessage.toLowerCase().includes('mughal') || userMessage.toLowerCase().includes('akbar')) {
    response = `👑 **Welcome to the Mughal Empire Adventure!**

You are a young **court artist** in **Fatehpur Sikri, 1575 CE**, during the reign of **Emperor Akbar the Great**. The palace is alive with creativity and innovation!

As you walk through the magnificent courtyards, you see:
- **Persian and Indian artists** collaborating on new projects
- **Scholars** from different religions debating in the **Ibadat Khana**
- **Musicians** practicing new compositions that blend cultures
- **Architects** working on the grand **Buland Darwaza**

You've been summoned to create something special - a new **coin design** celebrating Akbar's policy of **Sulh-e-Kul** (peace with all). This is your chance to make history!

**What would you like to do?**
1. **Design the new coin** with symbols of unity and peace
2. **Attend a debate** in the Ibadat Khana to understand different faiths
3. **Explore the palace** and learn about Akbar's innovative policies
4. **Meet with other artists** to collaborate on cultural projects

Choose your path and let's experience the **Golden Age of the Mughal Empire**! 🎨`;
  } else if (userMessage.toLowerCase().includes('freedom') || userMessage.toLowerCase().includes('british')) {
    response = `⚔️ **Welcome to the Freedom Struggle Adventure!**

You are a young **student** in **Calcutta, 1905 CE**, during the **Swadeshi Movement**. The city is alive with patriotic fervor and the spirit of independence!

As you walk through the streets, you see:
- **Students** boycotting British goods and promoting Indian products
- **Leaders** like **Surendranath Banerjee** addressing crowds
- **Artists** creating posters and songs to inspire the movement
- **Merchants** supporting the boycott of foreign goods

Your school has been organizing **Swadeshi meetings** and you've been chosen to speak about the importance of **self-reliance** and **national pride**. This is your chance to contribute to India's freedom!

**What would you like to do?**
1. **Give a speech** at the Swadeshi meeting about Indian unity
2. **Join the boycott** and encourage others to use Indian products
3. **Learn about the movement** from local leaders and activists
4. **Create patriotic art** to inspire your fellow students

Choose your path and let's fight for **India's Independence** together! 🇮🇳`;
  } else if (userMessage.toLowerCase().includes('indus') || userMessage.toLowerCase().includes('harappa')) {
    response = `🏺 **Welcome to the Indus Valley Civilization Adventure!**

You are an **archaeologist** in **1921 CE**, standing at the site of **Harappa**. You've just discovered the remains of an ancient civilization that thrived over 4000 years ago!

As you carefully excavate the site, you find:
- **Well-planned cities** with sophisticated grid layouts
- **Advanced drainage systems** that show remarkable engineering
- **Beautiful seals** with mysterious script that no one can read yet
- **Evidence of trade** with distant Mesopotamia
- **Sophisticated craftsmanship** in pottery and jewelry

This civilization, contemporary with ancient Egypt and Mesopotamia, shows remarkable urban planning and social organization. You're about to rewrite history!

**What would you like to investigate?**
1. **Explore the city planning** and understand their architectural genius
2. **Study the mysterious script** and try to decipher their writing system
3. **Investigate the trade networks** that connected them to the world
4. **Examine daily life** and understand their social structure

Choose your path and let's uncover the secrets of the **Indus Valley Civilization**! 🔍`;
  } else {
    response = `🏛️ **Welcome to NCERT History Adventure!**

I'm excited to create an immersive roleplaying experience for you! Based on your topic, I'll transform it into an exciting adventure where you'll:

- **Experience history firsthand** as a character from that time period
- **Make important decisions** that shaped historical events
- **Learn through storytelling** and interactive scenarios
- **Connect with the culture** and daily life of that era

**To get started, please tell me:**
- Which specific historical period or event interests you?
- Would you like to be a ruler, merchant, artist, soldier, or someone else?
- What aspect of that time period would you like to explore?

For example, you could say:
- "I want to be a merchant during the Mauryan Empire"
- "Let me experience the Mughal court during Akbar's reign"
- "I'd like to be a freedom fighter during the independence movement"
- "Take me to explore the Indus Valley Civilization"

**What historical adventure would you like to embark on today?** 🚀`;
  }

  return { message: response };
}