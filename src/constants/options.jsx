export const selectTravelsList = [
    {
        id: 1,
        title: "Just Me",
        desc: "A solo adventure designed around you",
        icon: "✈️",
        people: "1 person"
    },
    {
        id: 2,
        title: "A Couple",
        desc: "A romantic getaway or a duo’s escape",
        icon: "🥂",
        people: "2 people"
    },
    {
        id: 3,
        title: "Family",
        desc: "Perfect for parents and kids looking for memorable moments",
        icon: "👨‍👩‍👧‍👦",
        people: "3 to 5 people"
    },
    {
        id: 4,
        title: "Friends",
        desc: "An exciting trip with your favorite crew",
        icon: "🧑‍🤝‍🧑",
        people: "3 to 10 people"
    }
]

export const selectBudgetList = [
  {
    id: 1,
    title: "Budget",
    desc: "Great experiences without breaking the bank",
    icon: "💸",
    budgetRange: "Under $500"
  },
  {
    id: 2,
    title: "Mid-Range",
    desc: "Comfort and value, perfectly balanced",
    icon: "💰",
    budgetRange: "$500 - $1500"
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Indulgent escapes with premium experiences",
    icon: "💎",
    budgetRange: "$1500+"
  }
];


export const USER_PROMPT = `Generate a {noOfDays} day travel plan for the following:

- **Location**: {location}
- **Number of Days**: {noOfDays}
- **Traveler Type**: {traveller}
- **Budget**: {budget}

### Part 1: Hotel Options
Provide a list of 3 hotel options. For each hotel, include:
- Hotel name
- Hotel address
- Price per night
- Hotel image URL
- Geo coordinates (latitude and longitude)
- Star rating
- Short description

### Part 2: Suggested Itinerary
Suggest a day-wise travel plan for {noOfDays} days. For each day, include 2-3 places to visit. For each place, provide:
- Place name
- Description
- Geo coordinates
- Place image URL
- Ticket pricing (if any)
- Rating
- Time to spend there
- Best time to visit during the day (morning/afternoon/evening)

### Output Format
Return the entire result in **well-structured JSON** format with the following structure:

\`\`\`json
{
  "location": "Las Vegas",
  "budget": "Cheap",
  "days": 3,
  "travellerType": "Couple",
  "hotels": [
    {
      "name": "",
      "address": "",
      "price": "",
      "imageUrl": "",
      "geo": { "lat": "", "lng": "" },
      "rating": "",
      "description": ""
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "placeName": "",
          "description": "",
          "imageUrl": "",
          "geo": { "lat": "", "lng": "" },
          "ticketPrice": "",
          "rating": "",
          "timeToSpend": "",
          "bestTimeToVisit": ""
        }
      ]
    }
  ]
}
`