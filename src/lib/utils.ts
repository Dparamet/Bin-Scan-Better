import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WASTE_CATEGORIES = [
  {
    id: 'recyclable',
    title: 'Recyclable',
    description: 'Clean, dry materials that can be processed and reused to create new products.',
    icon: 'recycling',
    color: 'text-emerald-600',
    bg: 'bg-white',
    borderColor: 'border-emerald-50',
    iconBg: 'bg-emerald-50',
    items: [
      { name: 'Paper & Cardboard', icon: 'Box' },
      { name: 'Plastic Bottles', icon: 'Milk' },
      { name: 'Glass Jars & Bottles', icon: 'FlaskConical' },
      { name: 'Aluminum Cans', icon: 'CupSoda' }
    ],
    noLimit: 'No food-soiled paper (e.g., greasy pizza boxes) or soft plastics (plastic bags).'
  },
  {
    id: 'organic',
    title: 'Organic',
    description: 'Biodegradable materials that can break down naturally to create nutrient-rich compost.',
    icon: 'compost',
    color: 'text-lime-600',
    bg: 'bg-white',
    borderColor: 'border-lime-50',
    iconBg: 'bg-lime-50',
    items: [
      { name: 'Fruit & Veg Scraps', icon: 'Apple' },
      { name: 'Coffee & Tea', icon: 'Coffee' },
      { name: 'Eggshells', icon: 'Egg' },
      { name: 'Yard Waste', icon: 'Leaf' }
    ],
    noLimit: 'No plastic bags (unless certified compostable) or synthetic materials.'
  },
  {
    id: 'general',
    title: 'General',
    description: 'Non-recyclable and non-compostable items destined for landfill.',
    icon: 'delete',
    color: 'text-slate-500',
    bg: 'bg-white',
    borderColor: 'border-slate-100',
    iconBg: 'bg-slate-100',
    items: [
      { name: 'Wrappers & Bags', icon: 'ShoppingBag' },
      { name: 'Broken Ceramics', icon: 'WineOff' },
      { name: 'Sanitary Waste', icon: 'Baby' },
      { name: 'Soiled Containers', icon: 'Soup' }
    ],
    noLimit: 'Do not include recyclables, organics, or hazardous materials.'
  },
  {
    id: 'hazardous',
    title: 'Hazardous',
    description: 'Items that pose a risk to human health or the environment and require special disposal.',
    icon: 'warning',
    color: 'text-rose-600',
    bg: 'bg-white',
    borderColor: 'border-rose-50',
    iconBg: 'bg-rose-50',
    items: [
      { name: 'Batteries', icon: 'Battery' },
      { name: 'E-waste', icon: 'Cpu' },
      { name: 'Paint & Chemicals', icon: 'FlaskConical' },
      { name: 'Bulbs & Tubes', icon: 'Lightbulb' }
    ],
    noLimit: 'Take these items to a designated drop-off location or hazardous waste facility.'
  }
];

export const RECENT_SCANS = [
  {
    id: '1',
    name: 'Plastic Water Bottle',
    category: 'Beverage Container',
    type: 'Recyclable',
    points: 15,
    time: '10:42 AM',
    date: 'Today',
    icon: 'glass_water'
  },
  {
    id: '2',
    name: 'Cardboard Box',
    category: 'Packaging',
    type: 'Recyclable',
    points: 20,
    time: '09:15 AM',
    date: 'Today',
    icon: 'description'
  },
  {
    id: '3',
    name: 'Candy Wrapper',
    category: 'Soft Plastic',
    type: 'Landfill',
    points: 0,
    time: '4:15 PM',
    date: 'Yesterday',
    icon: 'delete'
  },
  {
    id: '4',
    name: 'Banana Peel',
    category: 'Food Waste',
    type: 'Compost',
    points: 10,
    time: '12:30 PM',
    date: 'Yesterday',
    icon: 'compost'
  },
  {
    id: '5',
    name: 'Egg Carton',
    category: 'Molded Pulp',
    type: 'Recyclable',
    points: 25,
    time: '11:05 AM',
    date: 'Yesterday',
    icon: 'egg_alt'
  }
];
