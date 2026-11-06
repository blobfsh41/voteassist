
import mayaImage from '../assets/maya.png'
import danielImage from '../assets/daniel.png'
import aishaImage from '../assets/aisha.png'
import type { Candidate } from './candidateTypes'

export const candidates: Candidate[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    party: 'Community Voice',
    image: mayaImage,
    policies: {
      housing: {
        title: 'More local homes',
        text: 'Support more affordable homes near tram routes and services, with a focus on renters.',
      },
      transport: {
        title: 'Frequent services',
        text: 'Advocate for more frequent trams and step-free stops along Sydney Road.',
      },
    },
  },
  {
    id: 'daniel-brooks',
    name: 'Daniel Brooks',
    party: 'Independent',
    image: danielImage,
    policies: {
      housing: {
        title: 'Planning & supply',
        text: 'Support faster approvals for smaller homes and publish local housing targets.',
      },
      transport: {
        title: 'Frequent services',
        text: 'Advocate for more frequent trams and step-free stops along Sydney Road.',
      },
    },
  },
  {
    id: 'aisha-patel',
    name: 'Aisha Patel',
    party: 'Local Tomorrow',
    image: aishaImage,
    policies: {
      housing: {
        title: 'Homes for everyone',
        text: 'Support affordable housing and community input into local planning.',
      },
      transport: {
        title: 'Better connections',
        text: 'Advocate for better bus connections to train stations and safer walks to stops.',
      },
    },
  },
]
