
import mayaImage from '../assets/maya.png'
import danielImage from '../assets/daniel.png'
import aishaImage from '../assets/aisha.png'

export const candidates = [
  {
    name: 'Maya Chen',
    party: 'Community Voice',
    image: mayaImage,
    policies: [
      {
        title: 'More local homes',
        text: 'Support more affordable homes near tram routes and services, with a focus on renters.',
      },
      {
        title: 'Frequent services',
        text: 'Advocate for more frequent trams and step-free stops along Sydney Road.',
      },
    ],
  },
  {
    name: 'Daniel Brooks',
    party: 'Independent',
    image: danielImage,
    policies: [
      {
        title: 'Planning & supply',
        text: 'Support faster approvals for smaller homes and publish local housing targets.',
      },
      {
        title: 'Better connections',
        text: 'Advocate for better bus connections to train stations and safer walks to stops.',
      },
    ],
  },
  {
    name: 'Aisha Patel',
    party: 'Local Tomorrow',
    image: aishaImage,
    policies: [
      {
        title: 'Homes for everyone',
        text: 'Support affordable housing and community input into local planning.',
      },
      {
        title: 'Connected communities',
        text: 'Support accessible public transport and safer routes to local stops.',
      },
    ],
  },
]
