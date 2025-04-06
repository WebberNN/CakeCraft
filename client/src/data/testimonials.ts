export interface Testimonial {
  id: number;
  name: string;
  city: string;
  rating: number;
  review: string;
  verified: boolean;
  timeAgo: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ada Obi",
    city: "Lagos",
    rating: 5,
    review: "I ordered a birthday cake for my daughter and it exceeded all expectations! Not only was it beautiful, but it tasted amazing too. Will definitely order again!",
    verified: true,
    timeAgo: "2 weeks ago"
  },
  {
    id: 2,
    name: "Tunde Adebayo",
    city: "Abuja",
    rating: 4.5,
    review: "Abie's Cake made our wedding day even more special. The cake was not only stunning but delicious too. Our guests couldn't stop talking about it!",
    verified: false,
    timeAgo: "1 month ago"
  },
  {
    id: 3,
    name: "Ifeoma Okonkwo",
    city: "Ibadan",
    rating: 5,
    review: "The cupcakes I ordered for my son's birthday party were a huge hit! They were not only beautiful but also delicious. Everyone at the party was impressed!",
    verified: true,
    timeAgo: "1 week ago"
  }
];
