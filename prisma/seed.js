/**
 * Seed 50 dummy users for FakeComm
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyUsers = [
  {
    name: 'Rahul Sharma',
    phone: '+919876543001',
    email: 'rahul.sharma@testmail.com',
    company: 'TechSoft Solutions',
    city: 'Mumbai',
  },
  {
    name: 'Priya Verma',
    phone: '+919876543002',
    email: 'priya.verma@testmail.com',
    company: 'Digital Dreams',
    city: 'Delhi',
  },
  {
    name: 'Amit Kumar',
    phone: '+919876543003',
    email: 'amit.kumar@testmail.com',
    company: 'CloudNine Tech',
    city: 'Bangalore',
  },
  {
    name: 'Sneha Gupta',
    phone: '+919876543004',
    email: 'sneha.gupta@testmail.com',
    company: 'StartUp Hub',
    city: 'Hyderabad',
  },
  {
    name: 'Vikram Singh',
    phone: '+919876543005',
    email: 'vikram.singh@testmail.com',
    company: 'Enterprise Corp',
    city: 'Chennai',
  },
  {
    name: 'Ananya Reddy',
    phone: '+919876543006',
    email: 'ananya.reddy@testmail.com',
    company: 'Innovate Labs',
    city: 'Pune',
  },
  {
    name: 'Rajesh Patel',
    phone: '+919876543007',
    email: 'rajesh.patel@testmail.com',
    company: 'Global Trade',
    city: 'Ahmedabad',
  },
  {
    name: 'Meera Iyer',
    phone: '+919876543008',
    email: 'meera.iyer@testmail.com',
    company: 'FinTech Pro',
    city: 'Kochi',
  },
  {
    name: 'Arjun Nair',
    phone: '+919876543009',
    email: 'arjun.nair@testmail.com',
    company: 'DataDriven Inc',
    city: 'Trivandrum',
  },
  {
    name: 'Kavita Menon',
    phone: '+919876543010',
    email: 'kavita.menon@testmail.com',
    company: 'EduTech Solutions',
    city: 'Coimbatore',
  },
  {
    name: 'Suresh Rao',
    phone: '+919876543011',
    email: 'suresh.rao@testmail.com',
    company: 'HealthFirst',
    city: 'Mangalore',
  },
  {
    name: 'Deepika Joshi',
    phone: '+919876543012',
    email: 'deepika.joshi@testmail.com',
    company: 'RetailMax',
    city: 'Jaipur',
  },
  {
    name: 'Karthik Subramanian',
    phone: '+919876543013',
    email: 'karthik.s@testmail.com',
    company: 'AutoMate Systems',
    city: 'Madurai',
  },
  {
    name: 'Neha Agarwal',
    phone: '+919876543014',
    email: 'neha.agarwal@testmail.com',
    company: 'FoodChain Pro',
    city: 'Lucknow',
  },
  {
    name: 'Sanjay Mehta',
    phone: '+919876543015',
    email: 'sanjay.mehta@testmail.com',
    company: 'BuildRight Constructions',
    city: 'Surat',
  },
  {
    name: 'Pooja Desai',
    phone: '+919876543016',
    email: 'pooja.desai@testmail.com',
    company: 'MediaWorks',
    city: 'Vadodara',
  },
  {
    name: 'Aakash Bhatia',
    phone: '+919876543017',
    email: 'aakash.bhatia@testmail.com',
    company: 'LogiTech Express',
    city: 'Nagpur',
  },
  {
    name: 'Ritu Kapoor',
    phone: '+919876543018',
    email: 'ritu.kapoor@testmail.com',
    company: 'FashionForward',
    city: 'Chandigarh',
  },
  {
    name: 'Manoj Pillai',
    phone: '+919876543019',
    email: 'manoj.pillai@testmail.com',
    company: 'GreenEnergy Co',
    city: 'Thiruvananthapuram',
  },
  {
    name: 'Swati Saxena',
    phone: '+919876543020',
    email: 'swati.saxena@testmail.com',
    company: 'TravelEase',
    city: 'Indore',
  },
  {
    name: 'Vivek Malhotra',
    phone: '+919876543021',
    email: 'vivek.malhotra@testmail.com',
    company: 'SecureNet Systems',
    city: 'Gurgaon',
  },
  {
    name: 'Anjali Krishnan',
    phone: '+919876543022',
    email: 'anjali.krishnan@testmail.com',
    company: 'PharmaCare',
    city: 'Mysore',
  },
  {
    name: 'Rohit Choudhary',
    phone: '+919876543023',
    email: 'rohit.choudhary@testmail.com',
    company: 'AgriTech India',
    city: 'Bhopal',
  },
  {
    name: 'Divya Narayanan',
    phone: '+919876543024',
    email: 'divya.narayanan@testmail.com',
    company: 'LegalEase',
    city: 'Visakhapatnam',
  },
  {
    name: 'Prakash Hegde',
    phone: '+919876543025',
    email: 'prakash.hegde@testmail.com',
    company: 'RealEstate Pro',
    city: 'Hubli',
  },
  {
    name: 'Lakshmi Venkatesh',
    phone: '+919876543026',
    email: 'lakshmi.v@testmail.com',
    company: 'InsureSafe',
    city: 'Tirupati',
  },
  {
    name: 'Nikhil Banerjee',
    phone: '+919876543027',
    email: 'nikhil.banerjee@testmail.com',
    company: 'EventPro',
    city: 'Kolkata',
  },
  {
    name: 'Shruti Pandey',
    phone: '+919876543028',
    email: 'shruti.pandey@testmail.com',
    company: 'BeautyBiz',
    city: 'Varanasi',
  },
  {
    name: 'Gaurav Tiwari',
    phone: '+919876543029',
    email: 'gaurav.tiwari@testmail.com',
    company: 'SportsFit',
    city: 'Kanpur',
  },
  {
    name: 'Pallavi Kulkarni',
    phone: '+919876543030',
    email: 'pallavi.kulkarni@testmail.com',
    company: 'HomeDecor Plus',
    city: 'Nashik',
  },
  {
    name: 'Siddharth Jain',
    phone: '+919876543031',
    email: 'siddharth.jain@testmail.com',
    company: 'JewelCraft',
    city: 'Jodhpur',
  },
  {
    name: 'Nandini Rao',
    phone: '+919876543032',
    email: 'nandini.rao@testmail.com',
    company: 'PetCare India',
    city: 'Belgaum',
  },
  {
    name: 'Ashwin Murthy',
    phone: '+919876543033',
    email: 'ashwin.murthy@testmail.com',
    company: 'GameZone Studios',
    city: 'Udupi',
  },
  {
    name: 'Tanvi Sharma',
    phone: '+919876543034',
    email: 'tanvi.sharma@testmail.com',
    company: 'WellnessFirst',
    city: 'Dehradun',
  },
  {
    name: 'Harish Gopal',
    phone: '+919876543035',
    email: 'harish.gopal@testmail.com',
    company: 'PackagePro',
    city: 'Salem',
  },
  {
    name: 'Sonali Das',
    phone: '+919876543036',
    email: 'sonali.das@testmail.com',
    company: 'BookWorld',
    city: 'Bhubaneswar',
  },
  {
    name: 'Varun Khanna',
    phone: '+919876543037',
    email: 'varun.khanna@testmail.com',
    company: 'MusicMania',
    city: 'Amritsar',
  },
  {
    name: 'Ishita Sen',
    phone: '+919876543038',
    email: 'ishita.sen@testmail.com',
    company: 'ArtGallery Online',
    city: 'Guwahati',
  },
  {
    name: 'Pranav Kulkarni',
    phone: '+919876543039',
    email: 'pranav.kulkarni@testmail.com',
    company: 'PrintShop Express',
    city: 'Aurangabad',
  },
  {
    name: 'Aditi Mishra',
    phone: '+919876543040',
    email: 'aditi.mishra@testmail.com',
    company: 'CleanHome Services',
    city: 'Patna',
  },
  {
    name: 'Venkat Raman',
    phone: '+919876543041',
    email: 'venkat.raman@testmail.com',
    company: 'ElectroMart',
    city: 'Trichy',
  },
  {
    name: 'Jyoti Sharma',
    phone: '+919876543042',
    email: 'jyoti.sharma@testmail.com',
    company: 'KidZone',
    city: 'Ranchi',
  },
  {
    name: 'Abhishek Nair',
    phone: '+919876543043',
    email: 'abhishek.nair@testmail.com',
    company: 'CafeConnect',
    city: 'Calicut',
  },
  {
    name: 'Megha Pillai',
    phone: '+919876543044',
    email: 'megha.pillai@testmail.com',
    company: 'FloristNow',
    city: 'Thrissur',
  },
  {
    name: 'Ravi Shankar',
    phone: '+919876543045',
    email: 'ravi.shankar@testmail.com',
    company: 'AutoService Pro',
    city: 'Vellore',
  },
  {
    name: 'Kritika Bhatt',
    phone: '+919876543046',
    email: 'kritika.bhatt@testmail.com',
    company: 'YogaLife',
    city: 'Rishikesh',
  },
  {
    name: 'Mohan Prasad',
    phone: '+919876543047',
    email: 'mohan.prasad@testmail.com',
    company: 'FurniturePlus',
    city: 'Vijayawada',
  },
  {
    name: 'Shweta Reddy',
    phone: '+919876543048',
    email: 'shweta.reddy@testmail.com',
    company: 'CosmeticsCo',
    city: 'Warangal',
  },
  {
    name: 'Anand Kumar',
    phone: '+919876543049',
    email: 'anand.kumar@testmail.com',
    company: 'GroceryMart',
    city: 'Raipur',
  },
  {
    name: 'Preeti Agarwal',
    phone: '+919876543050',
    email: 'preeti.agarwal@testmail.com',
    company: 'StationeryWorld',
    city: 'Dehradun',
  },
];

async function main() {
  console.log('🌱 Seeding FakeComm database...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.call.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  for (const user of dummyUsers) {
    await prisma.user.create({ data: user });
  }

  console.log(`✅ Created ${dummyUsers.length} dummy users`);

  // Create some initial config
  await prisma.config.upsert({
    where: { key: 'nexora_webhook_url' },
    update: { value: 'https://api.nexoraos.pro/api/v1' },
    create: { key: 'nexora_webhook_url', value: 'https://api.nexoraos.pro/api/v1' },
  });

  await prisma.config.upsert({
    where: { key: 'nexora_phone' },
    update: { value: '+919999999999' },
    create: { key: 'nexora_phone', value: '+919999999999' },
  });

  console.log('✅ Created config entries');
  console.log('🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
