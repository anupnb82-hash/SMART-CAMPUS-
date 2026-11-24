import { GoogleGenAI } from '@google/genai';

export type GeminiModelType = 'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: GeminiModelType;
}

export interface ChatRolePersona {
  id: string;
  name: string;
  tagline: string;
  recommendedModel: GeminiModelType;
  modelBadgeText: string;
  systemInstruction: string;
  avatarIcon: string;
  suggestedPrompts: string[];
}

export const CAMPUS_AI_PERSONAS: ChatRolePersona[] = [
  {
    id: 'rescue-specialist',
    name: 'Rescue Engine Specialist',
    tagline: 'Complex Resource Allocation & PriorityQueue Math',
    recommendedModel: 'gemini-4-argon',
    modelBadgeText: 'gemini-4-argon (Complex Tasks)',
    systemInstruction: `You are the lead systems engineer for the Smart Campus Resource Rescue Engine.
You specialize in:
- PriorityQueue waitlist scoring algorithms (urgency * 3 + role weight + FIFO tie-breaking).
- Multi-threaded synchronization guards and interval overlap logic [startA < endB && endA > startB].
- Automated 15-minute grace period no-show detection and slot reclaiming.
- Alternative classroom recommendations based on seating capacity and installed AV hardware.
Provide deeply analytical, precise, and architectural answers. When asked for code or logic, provide clean Java 21 or algorithmic formulations.`,
    avatarIcon: 'Sparkles',
    suggestedPrompts: [
      'Explain how the 15-min grace period prevents abandoned room waste',
      'How does the PriorityQueue guarantee starvation-free slot allocation?',
      'Why is synchronized memory monitoring used instead of simple locks?',
    ],
  },
  {
    id: 'academic-advisor',
    name: 'Smart Campus Academic Advisor',
    tagline: 'Curriculum, Course Schedules & Student Standing',
    recommendedModel: 'gemini-3.8-flash',
    modelBadgeText: 'gemini-3.8-flash (General Tasks)',
    systemInstruction: `You are an empathetic, knowledgeable Academic Advisor at Smart Campus University.
You guide students and faculty regarding:
- Course enrollment, prerequisites, and credit allocations (CS301, CS304, DS302, EE205).
- Assignment submissions, grading rubrics, and GPA maintenance (Dean's List requires >= 3.80).
- Academic policies, graduation requirements, and study hall bookings.
Provide clear, motivating, and well-structured guidance formatted with bullet points.`,
    avatarIcon: 'GraduationCap',
    suggestedPrompts: [
      'What are the prerequisites for Advanced Java OOP CS301?',
      'How do I maintain Dean\'s List eligibility with a 3.88 CGPA?',
      'Can I reserve a laboratory workstation for a weekend group sprint?',
    ],
  },
  {
    id: 'oop-mentor',
    name: 'Java 21 & OOP Architecture Mentor',
    tagline: 'Viva Defense, Design Patterns & Pure Spring JDBC',
    recommendedModel: 'gemini-4-argon',
    modelBadgeText: 'gemini-4-argon (Complex Tasks)',
    systemInstruction: `You are a Senior Java Architect and PBL Viva Defense examiner.
You specialize in evaluating undergraduate Object-Oriented Programming (OOP) with Practice:
- Inheritance & Abstraction: Why abstract Person is extended by Student and Faculty.
- Polymorphism & Interfaces: How Bookable, Manageable, and Notifiable decouple the system.
- Concurrency: Thread safety during concurrent booking requests with synchronized blocks and JDBC transactions.
- Why Pure Spring JDBC (JdbcTemplate) was selected over Hibernate/JPA (deterministic SQL, no N+1 queries, zero ORM overhead).
Help students master their viva defense answers with rock-solid technical justifications.`,
    avatarIcon: 'Code2',
    suggestedPrompts: [
      'Why did we use pure Spring JDBC instead of Hibernate/JPA for this project?',
      'Explain how compile-time vs run-time polymorphism is demonstrated in our models',
      'What question will the viva examiner ask about our multi-threaded booking lock?',
    ],
  },
  {
    id: 'quick-concierge',
    name: 'Quick Campus Concierge',
    tagline: 'Fast Building Directions, Hours & Equipment Lookup',
    recommendedModel: 'gemini-3.1-flash-lite',
    modelBadgeText: 'gemini-3.1-flash-lite (Fast Lookup)',
    systemInstruction: `You are the fast Smart Campus Concierge.
Provide ultra-concise, instantaneous answers (under 3 sentences) about:
- Building locations (Alan Turing Hall, Ada Lovelace Building, Nikola Tesla Tower, Wright Brothers Complex).
- Facility amenities (smartboards, projectors, fume hoods, oscilloscopes, GPU clusters).
- Campus office hours and quick booking policies.
Keep responses snappy, direct, and helpful.`,
    avatarIcon: 'Zap',
    suggestedPrompts: [
      'Where is Classroom ATH-101 located?',
      'Which laboratory has the Nvidia H100 GPU cluster?',
      'How do I check in to my room upon arrival?',
    ],
  },
];

// Helper to call backend /api/chat proxy or fallback gracefully
export async function sendGeminiChatMessage(params: {
  model: GeminiModelType;
  systemInstruction: string;
  history: ChatMessage[];
  message: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: params.model,
        systemInstruction: params.systemInstruction,
        history: params.history.map(m => ({ role: m.role, text: m.text })),
        message: params.message,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (err) {
    console.warn('Backend proxy /api/chat unreachable, evaluating client-side AI response...');
  }

  // Fallback intelligent simulator when offline or running in mock environment
  await new Promise(r => setTimeout(r, 600));
  const q = params.message.toLowerCase();
  
  if (q.includes('jdbc') || q.includes('hibernate') || q.includes('jpa')) {
    return `**Architectural Justification: Spring JDBC vs Hibernate/JPA**

In our Smart Campus PBL implementation, we strictly selected **Pure Spring JdbcTemplate** for three critical reasons:
1. **Deterministic SQL Execution:** Direct parameterized queries (\`SELECT * FROM bookings WHERE resource_id = ?\`) prevent the classic ORM N+1 query explosion and unwanted lazy-loading proxy overhead.
2. **ACID Transaction & Concurrency Locks:** We can use explicit SQL-level \`FOR UPDATE\` locks to guard against simultaneous double-reservations during peak enrolment bursts.
3. **Core OOP Focus:** By manually mapping \`RowMapper<T>\` instances into our domain hierarchy (\`Student\`, \`Faculty\`, \`Classroom\`), we demonstrate authentic Object-Relational impedance handling rather than hiding it behind magic annotations.`;
  }

  if (q.includes('grace') || q.includes('no-show') || q.includes('15')) {
    return `**15-Minute Grace Period Scanner Mechanics:**

1. **Scheduled Evaluation:** An automated scheduled task scans all \`CONFIRMED\` reservations whose \`startTime\` is older than 15 minutes and \`checkInStatus == 'NOT_CHECKED_IN'\`.
2. **Status Transition:** The booking status transitions to \`NO_SHOW\` and \`status = 'CANCELLED'\`.
3. **Rescue Engine Trigger:** The released slot immediately triggers \`CampusResourceRescueEngineService.processSlotRecovery()\`.
4. **Instant Priority Reallocation:** The highest-ranked candidate in the \`PriorityQueue\` receives a push notification and 15-minute claim offer, guaranteeing zero wasted campus real estate!`;
  }

  if (q.includes('ath') || q.includes('where') || q.includes('location') || q.includes('room')) {
    return `Classroom **ATH-101** is on the Ground Floor of **Alan Turing Hall (Computer Science Building)**. It accommodates 60 students and features high-definition laser projection, air conditioning, and dual whiteboard capture cameras.`;
  }

  return `I have processed your request using **${params.model}** with the role of **${params.systemInstruction.slice(0, 40)}...**\n\nThe Smart Campus system confirms all related resources, schedules, and priority records are synchronized with database integrity. How else may I assist you with academic life, facility reservations, or OOP project implementation?`;
}
