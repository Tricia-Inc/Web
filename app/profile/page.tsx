"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

// Sample journal data
const journalEntries = [
  {
    id: "1",
    title: "My grandson's new puppy",
    date: "Jan. 1st, 2025",
    thumbnail: "/puppy-image.jpg",
  },
  {
    id: "2",
    title: "City View",
    date: "Jan. 3rd, 2025",
    thumbnail: "/city-view.jpg",
  },
  {
    id: "3",
    title: "Morning Meetup",
    date: "Jan. 2nd, 2025",
    thumbnail: "/morning-meetup.jpg",
  },
  {
    id: "4",
    title: "Thoughts on Spring",
    date: "Jan. 18th, 2025",
    thumbnail: "/spring-flowers-meadow.png",
  },
  {
    id: "5",
    title: "Weekend Getaway",
    date: "Jan. 15th, 2025",
    thumbnail: "/beach-vacation-sunset.png",
  },
  {
    id: "6",
    title: "Family Dinner",
    date: "Jan. 20th, 2025",
    thumbnail: "/multigenerational-dinner.png",
  },
  {
    id: "7",
    title: "Garden Progress",
    date: "Jan. 22nd, 2025",
    thumbnail: "/senior-gardening.png",
  },
  {
    id: "8",
    title: "Old Friends Reunion",
    date: "Jan. 25th, 2025",
    thumbnail: "/senior-friends-cafe.png",
  },
]

export default function PersonalInfoPage() {
  const router = useRouter()
  const [name, setName] = useState("Alen Johnson")
  const [contactInfo, setContactInfo] = useState("+1 (555) 123-4567")
  const subscribedCount = 2 // Updated to match the number of community subscribed accounts

  const handleChangeName = () => {
    const newName = prompt("Enter new name:", name)
    if (newName && newName.trim() !== "") {
      setName(newName.trim())
    }
  }

  const handleChangeProfilePicture = () => {
    alert("Change profile picture functionality would be implemented here")
    // In a real app, this would open a file picker or camera
  }

  useEffect(() => {
    // In a real app, you'd get this from a context or state management
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setName(storedName)
    }

    // Get contact info from localStorage
    const storedPhone = localStorage.getItem("userPhone")
    const storedEmail = localStorage.getItem("userEmail")
    if (storedPhone) {
      setContactInfo(storedPhone)
    } else if (storedEmail) {
      setContactInfo(storedEmail)
    }
  }, [])

  const handleJournalClick = (journal: any) => {
    // Save journal data to localStorage for the journal preview page
    localStorage.setItem("journalTitle", journal.title)
    localStorage.setItem("journalDate", journal.date)
    localStorage.setItem("journalLocation", "Santa Barbara") // Default location
    localStorage.setItem("lastCapturedImage", journal.thumbnail)

    // Navigate to journal preview
    router.push("/journal-preview")
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-6">
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

        {/* Back button - Updated to use the new SVG icon */}
        <div className="relative">
          <button onClick={() => router.back()} className="absolute top-0 left-0 z-50">
            <img src="/icons/back-button-icon.svg" alt="Back" width={60} height={49} />
          </button>

          {/* Settings button - positioned relative to the container */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push("/settings")}
              className="w-[35px] h-[35px] flex items-center justify-center"
            >
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
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Top Section - Profile Info */}
        <div className="mb-6 mt-6">
          <div className="flex">
            {/* Profile Picture with change icon */}
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img src="/random-user-profile.png" alt="Profile" className="w-full h-full object-cover" />
              </div>

              {/* Change profile picture icon - with white background and black stroke */}
              <button
                onClick={handleChangeProfilePicture}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-[#4F4F4F] flex items-center justify-center"
                aria-label="Change profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4F4F4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>

            {/* Name and Contact Info */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-semibold text-[#4F4F4F] font-['Inter']">{name}</h2>

                {/* Change name icon */}
                <button onClick={handleChangeName} className="p-1" aria-label="Change name">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#4F4F4F]"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
              <p className="text-[16px] font-medium text-[#808080] font-['Inter']">{contactInfo}</p>
              <div className="flex items-center mt-4">
                <span className="text-[24px] font-semibold text-[#4F4F4F] font-['Inter']">Subscribed</span>
                <span className="text-[24px] font-medium text-[#4F4F4F] font-['Inter'] ml-4 text-center w-[64px]">
                  {subscribedCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* My Journal Section */}
        <div className="mb-4">
          <h3 className="text-[24px] font-semibold text-[#4F4F4F] font-['Inter']">My Journal</h3>
        </div>

        {/* Journal Entries - Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
          {/* Journal Entries */}
          {journalEntries.map((journal) => (
            <div className="flex justify-center" key={journal.id}>
              <div
                className="relative w-[398px] h-[200px] rounded-[20px] border border-[#E3E3E3] overflow-hidden"
                style={{
                  backgroundImage: `url('${journal.thumbnail}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleJournalClick(journal)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-[20px]"></div>
                <div className="absolute bottom-0 left-0 right-0 px-[26px] py-[19px] flex justify-between items-end">
                  <div>
                    <h4 className="text-[20px] font-bold text-white tracking-[0.2px] font-['Inter'] w-[268px]">
                      {journal.title}
                    </h4>
                    <p className="text-[16px] font-medium text-[#FCFCFC] font-['Inter']">{journal.date}</p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}
