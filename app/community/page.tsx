"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"

// Update the groups array to remove the Garden Club entry
const groups = [
  {
    id: "1",
    name: "Atterdag Village",
    members: 228,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atterdag-logo-4-color-top-Vgl5U6COuQkJShKJ5cSLQERqjebHNU.png", // Updated with Atterdag Village logo
    notifications: 1,
    author: "Senior Living",
    journals: [
      {
        id: "a1",
        title: "Self Growth",
        image: "/self-growth.png",
        date: "Jan. 1st, 2025",
        isNew: true,
      },
      {
        id: "a2",
        title: "Nature Walks",
        image: "/nature-walks.png",
        date: "Dec. 28th, 2024",
        isNew: false,
      },
    ],
  },
  {
    id: "2",
    name: "Translate Neuroscience", // Full name updated
    members: 170,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/collin%20liu%20.webp-0h12rcsIvOeJObyoACR0LpnMx0WTSb.png", // Updated with Colin Liu's image
    notifications: 2,
    author: "Colin Liu, MD.",
    subtitle: "Translate Neuroscience",
    journals: [
      {
        id: "b1",
        title: "Facing Memory",
        image: "/facing-memory.png",
        date: "Jan. 1st, 2025",
        isNew: true,
      },
      {
        id: "b2",
        title: "Focus",
        image: "/focus.png",
        date: "Jan. 2nd, 2025",
        isNew: true,
      },
      {
        id: "b3",
        title: "Brain Health",
        image: "/brain-health.png",
        date: "Dec. 20th, 2024",
        isNew: false,
      },
    ],
  },
]

// Update the feedItems array to keep only the first two entries related to the remaining groups
const feedItems = [
  {
    id: "1",
    title: "Self Growth",
    image: "/self-growth.png",
    author: "Senior Living",
    group: "Atterdag Village",
    timestamp: "Jan. 1st, 2025",
  },
  {
    id: "2",
    title: "Brain Health Tips",
    image: "/brain-health-tips.png",
    author: "Colin Liu, MD.",
    group: "Translate Neuroscience",
    timestamp: "Jan. 3rd, 2025",
  },
]

// Add this at the beginning of the component, after the imports
export default function CommunityPage() {
  const router = useRouter()
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [viewedNotifications, setViewedNotifications] = useState<Record<string, boolean>>({})
  const [scrollPosition, setScrollPosition] = useState(0)
  const profilesContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // Add a new state variable for the filler visibility
  const [showFiller, setShowFiller] = useState(false)
  // Add a new state to track viewed journals
  const [viewedJournals, setViewedJournals] = useState<Record<string, boolean>>({})

  // Find the selected group data
  const selectedGroupData = selectedGroup ? groups.find((group) => group.id === selectedGroup) : null

  // Handle group selection
  const handleGroupClick = (groupId: string) => {
    // If clicking the same group again, deselect it
    if (selectedGroup === groupId) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(groupId)

      // Mark notifications as viewed
      if (groups.find((g) => g.id === groupId)?.notifications) {
        setViewedNotifications({
          ...viewedNotifications,
          [groupId]: true,
        })
      }
    }
  }

  // Get effective notification count (0 if viewed)
  const getEffectiveNotifications = (groupId: string, notificationCount: number) => {
    return viewedNotifications[groupId] ? 0 : notificationCount
  }

  // Handle horizontal scroll for profile pictures
  const handleScroll = () => {
    if (profilesContainerRef.current) {
      setScrollPosition(profilesContainerRef.current.scrollLeft)
    }
  }

  // Navigate to journal view
  const handleJournalClick = (journalId: string) => {
    // Mark the journal as viewed
    setViewedJournals((prev) => ({
      ...prev,
      [journalId]: true,
    }))

    // Navigate to the journal view page
    router.push(`/community-journal/${journalId}`)
  }

  // Add scroll event listener
  useEffect(() => {
    const container = profilesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  // Add this to the useEffect section
  useEffect(() => {
    const handleScrollEvent = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop
        // Change from 180 to a lower value to make it stick earlier
        setIsHeaderSticky(scrollTop > 120)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScrollEvent)
      return () => {
        container.removeEventListener("scroll", handleScrollEvent)
      }
    }
  }, [])

  // Add this right before the return statement
  useEffect(() => {
    // Add a style tag for the sticky header behavior
    const styleTag = document.createElement("style")
    styleTag.innerHTML = `
      .sticky-active {
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding-top: 8px !important;
      }
    `
    document.head.appendChild(styleTag)

    return () => {
      document.head.removeChild(styleTag)
    }
  }, [])

  // Add useEffect to load viewed journals from localStorage on component mount
  useEffect(() => {
    const storedViewedJournals = localStorage.getItem("viewedJournals")
    if (storedViewedJournals) {
      setViewedJournals(JSON.parse(storedViewedJournals))
    }
  }, [])

  // Add useEffect to save viewed journals to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("viewedJournals", JSON.stringify(viewedJournals))
  }, [viewedJournals])

  return (
    <MobileLayout>
      <div className="flex flex-col h-full -mx-8 -my-8 relative">
        {/* Fixed background rectangle that covers the top area */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-[#F5F5F5]" style={{ height: "140px" }}></div>

        {/* Fixed Status Bar - In front of the background rectangle */}
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

        {/* Fixed Back Button - In front of the background rectangle */}
        <div className="absolute top-12 left-8 z-50">
          <button onClick={() => router.back()} className="w-[35px] h-[35px] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#4F4F4F]"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        {/* Fixed Subscribed Header - In front of the background rectangle */}
        <div className="absolute top-24 left-0 right-0 z-50 px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-[24px] font-semibold text-[#4F4F4F] font-['Inter']">Subscribed</h1>
            <div className="flex items-center gap-4">
              {/* Search button */}
              <button
                onClick={() => alert("Search functionality")}
                className="w-[40px] h-[40px] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#4F4F4F]"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* Add button */}
              <button
                onClick={() => alert("Add new subscription")}
                className="w-[40px] h-[40px] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#4F4F4F]"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Gap Filler - Only visible when header is sticky */}
        <div
          className={`absolute left-0 right-0 z-40 bg-[#F5F5F5] transition-opacity duration-100 ${
            showFiller ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            top: "70px",
            height: "90px", // Reduced from 110px to match the earlier sticky threshold
          }}
        ></div>

        {/* Scrollable Content Container - Adjusted to start below the fixed header */}
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto pt-40 pb-8 scrollbar-hide"
          onScroll={() => {
            if (scrollContainerRef.current) {
              const scrollTop = scrollContainerRef.current.scrollTop
              const stickyHeadersElement = document.getElementById("sticky-headers")
              if (stickyHeadersElement) {
                // Change from 180 to 120 to match the useEffect
                if (scrollTop > 120) {
                  stickyHeadersElement.classList.add("sticky-active")
                  setShowFiller(true)
                } else {
                  stickyHeadersElement.classList.remove("sticky-active")
                  setShowFiller(false)
                }
              }
            }
          }}
        >
          {/* Horizontal Group Scroll */}
          <div className="mb-8">
            <div
              ref={profilesContainerRef}
              className="flex overflow-x-auto pb-4 scrollbar-hide px-8"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {groups.map((group, index) => (
                <div
                  key={group.id}
                  className={`flex flex-col items-center min-w-[120px] ${
                    index === groups.length - 1 ? "pr-0" : "mr-6"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-[120px] h-[120px] rounded-full overflow-hidden ${
                        selectedGroup === group.id ? "border-[12px] border-[#876EE4]" : "border-0"
                      } mb-2 cursor-pointer`}
                      onClick={() => handleGroupClick(group.id)}
                    >
                      <div className="w-full h-full bg-[#E4E4E4] flex items-center justify-center">
                        {group.image ? (
                          <img
                            src={group.image || "/placeholder.svg"}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-[#4F4F4F]">{group.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>

                    {/* Notification Badge - Only show if not viewed */}
                    {getEffectiveNotifications(group.id, group.notifications) > 0 && (
                      <div className="absolute top-0 right-0 w-[36px] h-[36px] bg-[#876EE4] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{group.notifications}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-[16px] font-medium text-[#4F4F4F] text-center truncate w-full">{group.name}</h3>
                  <p className="text-[14px] text-[#808080] text-center">{group.members} members</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Headers Container */}
          <div
            id="sticky-headers"
            className="px-8 sticky top-0 bg-[#F5F5F5] z-40 transition-all duration-200 -mt-4 pt-4"
          >
            {/* Feed Header - Changes based on selection */}
            <div>
              {selectedGroupData ? (
                <div className="mb-4">
                  <h2 className="text-[24px] font-semibold text-[#876EE4] font-['Inter']">
                    {selectedGroupData.subtitle || selectedGroupData.name}
                  </h2>
                  {selectedGroupData.author && (
                    <p className="text-[18px] text-[#4F4F4F] font-['Inter']">{selectedGroupData.author}</p>
                  )}
                </div>
              ) : (
                <h2 className="text-[24px] font-semibold text-[#4F4F4F] font-['Inter'] mb-4">Community Feed</h2>
              )}
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-4 pb-4 px-8">
            {selectedGroupData
              ? // Show selected group's journals
                selectedGroupData.journals.map((journal) => (
                  <div
                    key={journal.id}
                    className="rounded-[20px] overflow-hidden border border-[#E3E3E3] relative cursor-pointer"
                    onClick={() => handleJournalClick(journal.id)}
                  >
                    <div
                      className="relative w-full h-[200px]"
                      style={{
                        backgroundImage: `url('${journal.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* NEW badge - only show if journal is new AND hasn't been viewed */}
                      {journal.isNew && !viewedJournals[journal.id] && (
                        <div className="absolute top-4 right-4 w-[60px] h-[60px] rounded-full bg-[#876EE4] flex items-center justify-center">
                          <span className="text-white font-bold text-xl">NEW</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-[28px] font-bold text-white">{journal.title}</h3>
                        <p className="text-[16px] text-white/80 mt-1">{journal.date}</p>
                      </div>
                    </div>
                  </div>
                ))
              : // Show general community feed
                feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] overflow-hidden border border-[#E3E3E3] cursor-pointer"
                    onClick={() => handleJournalClick(item.id)}
                  >
                    <div
                      className="relative w-full h-[200px]"
                      style={{
                        backgroundImage: `url('${item.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-[28px] font-bold text-white">{item.title}</h3>
                        <p className="text-[16px] text-white/80 mt-1">{item.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
