"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { Heart } from "lucide-react"

// Sample journal data - in a real app, this would come from an API or database
const journalData = {
  a1: {
    title: "Self Growth",
    image: "/self-growth.png",
    date: "Jan. 1st, 2025",
    location: "Santa Barbara",
    author: "Senior Living",
    authorId: "senior-living",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atterdag-logo-4-color-top-Vgl5U6COuQkJShKJ5cSLQERqjebHNU.png",
    content: `Self-growth is the continuous process of understanding and developing oneself to achieve one's fullest potential. It involves expanding self-awareness, improving personal skills, and building on strengths while addressing weaknesses.

The journey of self-growth requires honest self-reflection, openness to change, and willingness to step outside your comfort zone. By setting meaningful goals and taking consistent action, you create a path toward personal fulfillment and success.

Key aspects of self-growth include developing emotional intelligence, building resilience, cultivating healthy relationships, and maintaining physical and mental well-being. Each of these elements contributes to a more balanced and satisfying life.

Remember that self-growth is not about reaching perfection but embracing progress. Small, consistent improvements over time lead to significant personal transformation and a deeper sense of purpose.`,
  },
  a2: {
    title: "Nature Walks",
    image: "/nature-walks.png",
    date: "Dec. 28th, 2024",
    location: "Santa Barbara",
    author: "Senior Living",
    authorId: "senior-living",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atterdag-logo-4-color-top-Vgl5U6COuQkJShKJ5cSLQERqjebHNU.png",
    content: `Regular nature walks offer numerous benefits for physical and mental health. Walking through natural environments reduces stress, improves mood, and enhances cognitive function. The combination of physical activity and exposure to nature creates a powerful boost for overall well-being.

Studies show that spending time in green spaces lowers blood pressure, decreases anxiety, and improves attention span. The natural sights, sounds, and smells engage our senses in ways that built environments cannot, providing a refreshing break from digital stimulation.

For seniors, nature walks are particularly beneficial. They provide low-impact exercise that maintains mobility, strengthens muscles, and improves balance. The social aspect of group walks also combats isolation and fosters community connections.

Incorporating regular nature walks into your routine doesn't require elaborate planning. Even short, frequent walks in local parks or gardens can provide significant health benefits and a deeper connection to the natural world.`,
  },
  b1: {
    title: "Facing Memory",
    image: "/facing-memory.png",
    date: "Jan. 1st, 2025",
    location: "Santa Barbara",
    author: "Colin Liu, MD.",
    authorId: "colin-liu",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/collin%20liu%20.webp-0h12rcsIvOeJObyoACR0LpnMx0WTSb.png",
    content: `Memory is a complex cognitive process that allows us to encode, store, and retrieve information. Understanding how memory works can help us develop strategies to improve recall and address common memory challenges.

The brain's memory systems include working memory (short-term), episodic memory (personal experiences), semantic memory (facts and concepts), and procedural memory (skills and habits). Each system plays a unique role in how we process and retain information.

Age-related memory changes are normal and differ from dementia or Alzheimer's disease. Normal aging may affect the speed of recall or make it harder to multitask, but doesn't significantly impair daily functioning or the ability to learn new information.

Research-backed strategies to support memory include regular physical exercise, adequate sleep, stress management, and cognitive stimulation. Social engagement and a nutritious diet rich in antioxidants and omega-3 fatty acids also contribute to brain health and memory function.`,
  },
  b2: {
    title: "Focus",
    image: "/focus.png",
    date: "Jan. 2nd, 2025",
    location: "Santa Barbara",
    author: "Colin Liu, MD.",
    authorId: "colin-liu",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/collin%20liu%20.webp-0h12rcsIvOeJObyoACR0LpnMx0WTSb.png",
    content: `Focus is the brain's ability to direct attention toward a specific task while filtering out distractions, a process primarily governed by the prefrontal cortex. This region acts like a command center, coordinating thoughts, actions, and decision-making.

Neurotransmitters like dopamine and norepinephrine play crucial roles in maintaining attention by enhancing signal strength in neural circuits responsible for goal-directed behavior. When these chemical messengers are balanced, the brain can sustain attention with clarity and purpose.

Modern life presents unique challenges to our attention systems. Digital devices, notifications, and information overload can fragment our focus and train our brains to seek constant novelty. This environment makes sustained attention increasingly difficult.

Practical strategies to improve focus include mindfulness meditation, regular breaks using techniques like the Pomodoro method, eliminating unnecessary distractions, and prioritizing adequate sleep. Physical exercise also enhances focus by improving blood flow to the brain and promoting the growth of new neural connections.`,
  },
  b3: {
    title: "Brain Health",
    image: "/brain-health.png",
    date: "Dec. 20th, 2024",
    location: "Santa Barbara",
    author: "Colin Liu, MD.",
    authorId: "colin-liu",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/collin%20liu%20.webp-0h12rcsIvOeJObyoACR0LpnMx0WTSb.png",
    content: `Brain health encompasses the various factors that allow your brain to perform optimally across cognitive, emotional, and behavioral domains. A healthy brain adapts to new information, recovers from stress, and maintains neural connections that support memory, attention, and problem-solving.

The concept of neuroplasticity—the brain's ability to form new neural connections throughout life—offers hope for maintaining and even improving brain function as we age. This remarkable adaptability means that our daily habits and activities directly influence brain structure and function.

Key pillars of brain health include physical exercise, which increases blood flow and promotes the growth of new neurons; cognitive stimulation through learning and novel experiences; quality sleep, which allows the brain to clear waste and consolidate memories; and stress management techniques that protect against harmful effects of chronic stress.

Nutrition also plays a vital role in brain health. The Mediterranean and MIND diets, rich in vegetables, fruits, whole grains, fish, and healthy fats, have been associated with better cognitive outcomes and reduced risk of neurodegenerative diseases. Staying socially connected and maintaining a sense of purpose further contribute to cognitive resilience.`,
  },
  e1: {
    title: "Spring Planting",
    image: "/spring-planting.jpg",
    date: "Jan. 2nd, 2025",
    location: "Santa Barbara",
    author: "Green Thumbs",
    authorId: "green-thumbs",
    authorImage: "/gardener-profile.png",
    content: `Spring planting marks the beginning of the gardening season, offering a fresh start and the promise of growth. Preparing your garden for spring involves several key steps that set the foundation for a successful growing season.

Begin by assessing your soil condition after winter. Test the pH and nutrient levels, then amend with compost or other organic matter as needed. This ensures your plants have the nutrients they need to thrive. Wait until the soil is workable—when it crumbles easily in your hand and isn't soggy.

Consider your local climate and frost dates when planning what to plant. Cool-season vegetables like lettuce, peas, and spinach can be planted earlier, while warm-season crops like tomatoes and peppers should wait until after the last frost date. Perennial flowers and shrubs are also ideal for spring planting, giving them time to establish before summer heat.

For seniors, gardening offers numerous benefits beyond beautiful plants. It provides gentle exercise, exposure to vitamin D, stress reduction, and a sense of accomplishment. Raised beds, vertical gardens, and ergonomic tools can make gardening more accessible and enjoyable for those with limited mobility or strength.`,
  },
  "1": {
    title: "Self Growth",
    image: "/self-growth.png",
    date: "Jan. 1st, 2025",
    location: "Santa Barbara",
    author: "Senior Living",
    authorId: "senior-living",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atterdag-logo-4-color-top-Vgl5U6COuQkJShKJ5cSLQERqjebHNU.png",
    content: `Self-growth is the continuous process of understanding and developing oneself to achieve one's fullest potential. It involves expanding self-awareness, improving personal skills, and building on strengths while addressing weaknesses.

The journey of self-growth requires honest self-reflection, openness to change, and willingness to step outside your comfort zone. By setting meaningful goals and taking consistent action, you create a path toward personal fulfillment and success.

Key aspects of self-growth include developing emotional intelligence, building resilience, cultivating healthy relationships, and maintaining physical and mental well-being. Each of these elements contributes to a more balanced and satisfying life.

Remember that self-growth is not about reaching perfection but embracing progress. Small, consistent improvements over time lead to significant personal transformation and a deeper sense of purpose.`,
  },
  "2": {
    title: "Brain Health Tips",
    image: "/brain-health-tips.png",
    date: "Jan. 3rd, 2025",
    location: "Santa Barbara",
    author: "Colin Liu, MD.",
    authorId: "colin-liu",
    authorImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/collin%20liu%20.webp-0h12rcsIvOeJObyoACR0LpnMx0WTSb.png",
    content: `Brain health encompasses the various factors that allow your brain to perform optimally across cognitive, emotional, and behavioral domains. A healthy brain adapts to new information, recovers from stress, and maintains neural connections that support memory, attention, and problem-solving.

The concept of neuroplasticity—the brain's ability to form new neural connections throughout life—offers hope for maintaining and even improving brain function as we age. This remarkable adaptability means that our daily habits and activities directly influence brain structure and function.

Key pillars of brain health include physical exercise, which increases blood flow and promotes the growth of new neurons; cognitive stimulation through learning and novel experiences; quality sleep, which allows the brain to clear waste and consolidate memories; and stress management techniques that protect against harmful effects of chronic stress.

Nutrition also plays a vital role in brain health. The Mediterranean and MIND diets, rich in vegetables, fruits, whole grains, fish, and healthy fats, have been associated with better cognitive outcomes and reduced risk of neurodegenerative diseases. Staying socially connected and maintaining a sense of purpose further contribute to cognitive resilience.`,
  },
  "3": {
    title: "Community Garden Update",
    image: "/community-garden.png",
    date: "Dec. 30th, 2024",
    location: "Santa Barbara",
    author: "Green Thumbs",
    authorId: "green-thumbs",
    authorImage: "/gardener-profile.png",
    content: `Our community garden has flourished this year thanks to the dedicated efforts of our members. The shared space has transformed into a vibrant ecosystem of vegetables, flowers, and herbs that benefit both the gardeners and the broader community.

This season's highlights include the expansion of our accessible raised beds, making gardening possible for members with mobility challenges. We've also implemented a rainwater collection system that has significantly reduced our water usage while keeping our plants thriving.

The garden continues to serve as more than just a place to grow food—it's a hub for social connection, knowledge sharing, and intergenerational learning. Our weekly garden meetups have fostered new friendships and provided opportunities for experienced gardeners to mentor newcomers.

Looking ahead to the new year, we're planning to add a butterfly garden section, expand our composting program, and host monthly workshops on sustainable gardening practices. We welcome all community members to participate, regardless of gardening experience.`,
  },
}

export default function JournalView({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [liked, setLiked] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Get journal data based on ID
  const journal = journalData[id] || {
    title: "Journal Entry",
    image: "/open-leather-journal.png",
    date: "Jan. 1st, 2025",
    location: "Santa Barbara",
    author: "Unknown Author",
    authorId: "",
    authorImage: "/abstract-profile.png",
    content: "This journal entry could not be found.",
  }

  // Handle scroll for image parallax effect
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollY(scrollContainerRef.current.scrollTop)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  // Navigate to creator profile when clicking on profile picture
  const handleAuthorClick = () => {
    if (journal.authorId) {
      router.push(`/creator-profile/${journal.authorId}`)
    }
  }

  // Calculate image height based on scroll position
  const imageHeight = Math.max(200, 400 - scrollY * 0.5)

  return (
    <MobileLayout>
      {/* Back Button - Positioned exactly like in personal journal preview */}
      <button onClick={() => router.back()} className="absolute top-20 left-8 z-50" aria-label="Back">
        <div className="w-[60px] h-[60px] rounded-full bg-[rgba(155,155,155,0.38)] flex items-center justify-center">
          <svg width="60" height="49" viewBox="0 0 60 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M26.6657 38.7917L9.99902 24.5M9.99902 24.5L26.6657 10.2083M9.99902 24.5L49.999 24.5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className="flex flex-col h-full relative bg-[#f4f4f4] -mx-8 -my-8">
        {/* Like Button */}
        <div className="absolute top-20 right-8 z-50">
          <button
            onClick={() => setLiked(!liked)}
            className="w-[60px] h-[60px] rounded-full bg-[rgba(155,155,155,0.38)] flex items-center justify-center"
            aria-label="Like"
          >
            <Heart className={`w-8 h-8 ${liked ? "text-[#fb5b5b] fill-[#fb5b5b]" : "text-white"}`} />
          </button>
        </div>

        {/* Scrollable container */}
        <div ref={scrollContainerRef} className="h-full overflow-y-auto scrollbar-hide">
          {/* Header image with parallax effect */}
          <div className="w-full relative overflow-hidden" style={{ height: `${imageHeight}px` }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${journal.image}')`,
                transform: `translateY(${scrollY * 0.2}px)`,
                height: `${imageHeight + 100}px`,
              }}
            />
          </div>

          {/* Content container */}
          <div className="bg-white rounded-t-[30px] -mt-8 relative z-10 min-h-screen">
            <div className="px-8 pt-8 pb-24">
              {/* Title and author section */}
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-[32px] font-bold text-[#2b2b2b]">{journal.title}</h1>
                {/* Author Profile Picture - Now clickable */}
                <div
                  className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer"
                  onClick={handleAuthorClick}
                >
                  <img
                    src={journal.authorImage || "/placeholder.svg"}
                    alt={journal.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Date and location */}
              <div className="flex items-center text-[#6f6f6f] mb-6">
                <span className="text-[18px]">{journal.date}</span>
                <span className="mx-2">•</span>
                <span className="text-[18px]">{journal.location}</span>
              </div>

              {/* Journal content */}
              <div className="text-[18px] leading-relaxed text-[#2b2b2b] whitespace-pre-line">{journal.content}</div>
            </div>
          </div>
        </div>

        {/* Fixed microphone button at bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button className="w-[70px] h-[70px] rounded-full bg-[#2b2b2b] flex items-center justify-center shadow-lg">
            <svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 0.5C13.5913 0.5 15.1174 1.13214 16.2426 2.25736C17.3679 3.38258 18 4.9087 18 6.5V17C18 18.5913 17.3679 20.1174 16.2426 21.2426C15.1174 22.3679 13.5913 23 12 23C10.4087 23 8.88258 22.3679 7.75736 21.2426C6.63214 20.1174 6 18.5913 6 17V6.5C6 4.9087 6.63214 3.38258 7.75736 2.25736C8.88258 1.13214 10.4087 0.5 12 0.5ZM12 2.5C10.9391 2.5 9.92172 2.92143 9.17157 3.67157C8.42143 4.42172 8 5.43913 8 6.5V17C8 18.0609 8.42143 19.0783 9.17157 19.8284C9.92172 20.5786 10.9391 21 12 21C13.0609 21 14.0783 20.5786 14.8284 19.8284C15.5786 19.0783 16 18.0609 16 17V6.5C16 5.43913 15.5786 4.42172 14.8284 3.67157C14.0783 2.92143 13.0609 2.5 12 2.5ZM3 14.5C3.26522 14.5 3.51957 14.6054 3.70711 14.7929C3.89464 14.9804 4 15.2348 4 15.5V17C4 19.1217 4.84285 21.1566 6.34315 22.6569C7.84344 24.1571 9.87827 25 12 25C14.1217 25 16.1566 24.1571 17.6569 22.6569C19.1571 21.1566 20 19.1217 20 17V15.5C20 15.2348 20.1054 14.9804 20.2929 14.7929C20.4804 14.6054 20.7348 14.5 21 14.5C21.2652 14.5 21.5196 14.6054 21.7071 14.7929C21.8946 14.9804 22 15.2348 22 15.5V17C22 19.3861 21.0518 21.6737 19.364 23.364C17.6761 25.0543 15.3869 26.0044 13 26.05V31.5H17C17.2652 31.5 17.5196 31.6054 17.7071 31.7929C17.8946 31.9804 18 32.2348 18 32.5C18 32.7652 17.8946 33.0196 17.7071 33.2071C17.5196 33.3946 17.2652 33.5 17 33.5H7C6.73478 33.5 6.48043 33.3946 6.29289 33.2071C6.10536 33.0196 6 32.7652 6 32.5C6 32.2348 6.10536 31.9804 6.29289 31.7929C6.48043 31.6054 6.73478 31.5 7 31.5H11V26.05C8.61312 26.0044 6.32387 25.0543 4.63604 23.364C2.94821 21.6737 2 19.3861 2 17V15.5C2 15.2348 2.10536 14.9804 2.29289 14.7929C2.48043 14.6054 2.73478 14.5 3 14.5Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center pt-2 pb-4 px-8">
          <div className="text-[17px] font-semibold">9:41</div>
          <div className="flex items-center gap-1">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 6C1 4.93913 1.42143 3.92172 2.17157 3.17157C2.92172 2.42143 3.93913 2 5 2H13C14.0609 2 15.0783 2.42143 15.8284 3.17157C16.5786 3.92172 17 4.93913 17 6V10C17 11.0609 16.5786 12.0783 15.8284 12.8284C15.0783 13.5786 14.0609 14 13 14H5C3.93913 14 2.92172 13.5786 2.17157 12.8284C1.42143 12.0783 1 11.0609 1 10V6Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6 14V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 10V10.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 6C19.5523 6 20 6.44772 20 7V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9V7C18 6.44772 18.4477 6 19 6Z"
                fill="black"
              />
              <path
                d="M15 3C15.5523 3 16 3.44772 16 4V12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12V4C14 3.44772 14.4477 3 15 3Z"
                fill="black"
              />
              <path
                d="M11 0C11.5523 0 12 0.447715 12 1V15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V1C10 0.447715 10.4477 0 11 0Z"
                fill="black"
              />
              <path
                d="M7 4C7.55228 4 8 4.44772 8 5V11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11V5C6 4.44772 6.44772 4 7 4Z"
                fill="black"
              />
              <path
                d="M3 6C3.55228 6 4 6.44772 4 7V9C4 9.55228 3.55228 10 3 10C2.44772 10 2 9.55228 2 9V7C2 6.44772 2.44772 6 3 6Z"
                fill="black"
              />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="black" />
              <path d="M23 4V8C24.1046 7.66122 25 6.17335 25 5C25 3.82665 24.1046 2.33878 23 2V4Z" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
