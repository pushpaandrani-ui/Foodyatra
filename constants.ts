
import { Village, Restaurant, Rider } from './types';

// Helper to calculate time
// Approx 2.5 mins per km + 10 min prep/buffer
const calcTime = (dist: number) => {
  if (dist === 0) return "15-20 min";
  const mins = Math.ceil(dist * 2.5 + 15); 
  return `${mins}-${mins + 10} min`;
};

export const RIDERS: Rider[] = [
  { id: 'rider_1', name: 'Ramesh Kumar', phone: '9876543210', active: true },
  { id: 'rider_2', name: 'Suresh Patel', phone: '9876543211', active: true },
  { id: 'rider_3', name: 'Mahesh Thakor', phone: '9876543212', active: true },
  { id: 'rider_4', name: 'Vikram Rabari', phone: '9876543213', active: true },
];

export const VILLAGES: Village[] = [
  { id: 'v_abasana', name: 'Abasana', distance: 14.4 },
  { id: 'v_anandpura', name: 'Anandpura', distance: 9 },
  { id: 'v_aspa', name: 'Aspa', distance: 14 },
  { id: 'v_babipura', name: 'Babipura', distance: 4 },
  { id: 'v_badarpur', name: 'Badarpur', distance: 4 },
  { id: 'v_bajpura', name: 'Bajpura', distance: 5 },
  { id: 'v_bhalak', name: 'Bhalak', distance: 12.8 },
  { id: 'v_champa', name: 'Champa', distance: 3 },
  { id: 'v_chandpur', name: 'Chandpur', distance: 8 },
  { id: 'v_chhabaliya', name: 'Chhabaliya', distance: 17 },
  { id: 'v_dabu', name: 'Dabu', distance: 23 },
  { id: 'v_ganeshpura', name: 'Ganeshpura', distance: 5 },
  { id: 'v_gothawa', name: 'Gothawa', distance: 19.8 },
  { id: 'v_gunja', name: 'Gunja', distance: 4.7 },
  { id: 'v_hajipur', name: 'Hajipur', distance: 4 },
  { id: 'v_jagapura', name: 'Jagapura', distance: 12 },
  { id: 'v_jantral', name: 'Jantral', distance: 14.9 },
  { id: 'v_jaska', name: 'Jaska', distance: 14.7 },
  { id: 'v_kahipur', name: 'Kahipur', distance: 8.4 },
  { id: 'v_kalyanpura', name: 'Kalyanpura (near Shobhasan)', distance: 14.6 },
  { id: 'v_kamalpur', name: 'Kamalpur', distance: 8 },
  { id: 'v_karbatiya', name: 'Karbatiya', distance: 11.6 },
  { id: 'v_karshanpura', name: 'Karshanpura', distance: 7 },
  { id: 'v_kesimpa', name: 'Kesimpa', distance: 11 },
  { id: 'v_khanpur', name: 'Khanpur', distance: 8 },
  { id: 'v_kharod', name: 'Kharod', distance: 18.8 },
  { id: 'v_khatasana', name: 'Khatasana', distance: 4 },
  { id: 'v_khatoda', name: 'Khatoda', distance: 10 },
  { id: 'v_kheralu', name: 'Kheralu', distance: 13.9 },
  { id: 'v_malekpur', name: 'Malekpur', distance: 3 },
  { id: 'v_mirjhapur', name: 'Mirjhapur', distance: 3 },
  { id: 'v_molipur', name: 'Molipur', distance: 9 },
  { id: 'v_navapura', name: 'Navapura', distance: 4 },
  { id: 'v_pipaldar', name: 'Pipaldar', distance: 6 },
  { id: 'v_rajpur', name: 'Rajpur', distance: 4 },
  { id: 'v_ransipur', name: 'Ransipur', distance: 18.8 },
  { id: 'v_sabalpur', name: 'Sabalpur', distance: 6 },
  { id: 'v_sarna', name: 'Sarna', distance: 8 },
  { id: 'v_shahpur', name: 'Shahpur', distance: 5 },
  { id: 'v_shekhpur', name: 'Shekhpur', distance: 15 },
  { id: 'v_shobhasan', name: 'Shobhasan', distance: 15 },
  { id: 'v_sipor', name: 'Sipor', distance: 11.2 },
  { id: 'v_sulipur', name: 'Sulipur', distance: 5 },
  { id: 'v_sultanpura', name: 'Sultanpura', distance: 5 },
  { id: 'v_sundhia', name: 'Sundhia', distance: 9 },
  { id: 'v_transvad', name: 'Transvad', distance: 8 },
  { id: 'v_umta', name: 'Umta', distance: 7.7 },
  { id: 'v_undani', name: 'Undani', distance: 5 },
  { id: 'v_undhai', name: 'Undhai', distance: 9 },
  { id: 'v_vadnagar', name: 'Vadnagar (City)', distance: 0 },
  { id: 'v_vaghadi', name: 'Vaghadi', distance: 5 },
  { id: 'v_vaghdi', name: 'Vaghdi', distance: 19 },
  { id: 'v_vagvadi', name: 'Vagvadi N.O', distance: 20 },
  { id: 'v_vaktapur', name: 'Vaktapur', distance: 5 },
  { id: 'v_valasana', name: 'Valasana', distance: 15 },
].map(v => ({ ...v, timeEstimate: calcTime(v.distance) })).sort((a, b) => a.name.localeCompare(b.name));

// Using specific unsplash photo IDs for maximum reliability
export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Hotel Riza',
    cuisine: 'Punjabi, Chinese',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r1-d1', name: 'Paneer Makhani', price: 0, isVeg: true, description: 'Rich creamy tomato curry with paneer', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80' }, 
      { id: 'r1-d2', name: 'Spicy Garlic Noodles', price: 0, isVeg: true, description: 'Stir-fried noodles with garlic', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
      { id: 'r1-d3', name: 'Dal Tadka & Jeera Rice', price: 0, isVeg: true, description: 'Yellow lentils with cumin rice', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r2',
    name: 'Food Paradise Restaurant',
    cuisine: 'South Indian, Jain',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e7?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r2-d1', name: 'Masala Dosa', price: 145, isVeg: true, description: 'Crispy crepe with potato masala (App Price)', image: 'https://images.unsplash.com/photo-1589301760576-416ccd2fc8b3?auto=format&fit=crop&w=400&q=80' },
      { id: 'r2-d2', name: 'Veg Uttapam', price: 130, isVeg: true, description: 'Thick pancake with vegetables', image: 'https://images.unsplash.com/photo-1630409346824-4f0e7b040acc?auto=format&fit=crop&w=400&q=80' },
      { id: 'r2-d3', name: 'Fixed Jain Thali', price: 220, isVeg: true, description: 'Complete meal without onion/garlic', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r3',
    name: 'MS FOOD & CAFE',
    cuisine: 'Burgers, Pizza, Fast Food',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r3-d1', name: 'Veg Cheese Burger', price: 90, isVeg: true, description: 'Crispy patty with cheese slice (App Price)', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80' },
      { id: 'r3-d2', name: 'Italian Pizza', price: 180, isVeg: true, description: 'Topped with exotic veggies', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80' },
      { id: 'r3-d3', name: 'Kutchi Dabeli', price: 35, isVeg: true, description: 'Spicy potato burger style snack', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
      { id: 'r3-d4', name: 'Bombay Pav Bhaji', price: 130, isVeg: true, description: 'Butter loaded vegetable mash', image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r4',
    name: 'Bahuchar Bhojnalay',
    cuisine: 'Gujarati Thali',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r4-d1', name: 'Unlimited Gujarati Thali', price: 0, isVeg: true, description: 'Roti, Sabji, Dal, Rice, Buttermilk', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r5',
    name: 'Swagat Nasta House',
    cuisine: 'Breakfast, Snacks',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r5-d1', name: 'Morning Fafda & Jalebi', price: 0, isVeg: true, description: 'Crispy snacks with sweet jalebi', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80' },
      { id: 'r5-d2', name: 'Khaman & Dhokla', price: 0, isVeg: true, description: 'Steamed spicy sponge cakes', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80' },
      { id: 'r5-d3', name: 'Hot Tea (Kitli Special)', price: 0, isVeg: true, description: 'Masala chai', image: 'https://images.unsplash.com/photo-1596920566829-d9de45b598fe?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r6',
    name: 'Veral Krupa Bhajipav',
    cuisine: 'Bhaji Pav, Pulav',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r6-d1', name: 'Butter Bhaji Pav', price: 0, isVeg: true, description: 'Spicy mashed veggies with butter buns', image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=400&q=80' },
      { id: 'r6-d2', name: 'Masala Pav', price: 0, isVeg: true, description: 'Fried buns with spices', image: 'https://images.unsplash.com/photo-1625398407796-b0d2f660275c?auto=format&fit=crop&w=400&q=80' },
      { id: 'r6-d3', name: 'Tawa Pulav', price: 0, isVeg: true, description: 'Fried rice with veggies', image: 'https://images.unsplash.com/photo-1613292443284-8d8595c185f2?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r7',
    name: 'New Surti Pav Bhaji & Dhosa',
    cuisine: 'Pav Bhaji, Dosa',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1589301760576-416ccd2fc8b3?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r7-d1', name: 'Mysore Masala Dosa', price: 165, isVeg: true, description: 'Spicy dosa with red chutney (App Price)', image: 'https://images.unsplash.com/photo-1589301760576-416ccd2fc8b3?auto=format&fit=crop&w=400&q=80' },
      { id: 'r7-d2', name: 'Surti Pav Bhaji', price: 140, isVeg: true, description: 'Authentic Surti style taste', image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=400&q=80' },
      { id: 'r7-d3', name: 'Paper Dosa', price: 110, isVeg: true, description: 'Super thin crispy crepe', image: 'https://images.unsplash.com/photo-1630409346824-4f0e7b040acc?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r8',
    name: 'Pruthvi Restaurant',
    cuisine: 'Multi-Cuisine',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r8-d1', name: 'Dinner for Two', price: 385, isVeg: true, description: 'Full meal combo for 2 people (App Price)', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'r8-d2', name: 'Paneer Angara', price: 220, isVeg: true, description: 'Smoked spicy paneer curry', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80' },
      { id: 'r8-d3', name: 'Butter Naan', price: 45, isVeg: true, description: 'Tandoor baked bread', image: 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'r9',
    name: 'Sangam Restaurant',
    cuisine: 'Punjabi, Gujarati',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    dishes: [
      { id: 'r9-d1', name: 'Dal Palak', price: 0, isVeg: true, description: 'Healthy spinach and lentil curry', image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=400&q=80' },
      { id: 'r9-d2', name: 'Gujarati Kadhi Khichdi', price: 0, isVeg: true, description: 'Comfort food combo', image: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?auto=format&fit=crop&w=400&q=80' },
      { id: 'r9-d3', name: 'Sev Tameta', price: 0, isVeg: true, description: 'Spicy tomato curry with sev', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80' },
    ]
  }
];