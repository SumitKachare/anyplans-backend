import { Client } from "pg";
import ENV from "../config/env.config";
import { faker } from "@faker-js/faker";

// npx dbmate drop
// npx dbmate up
// npm run db-seed
// npm run db-clear

type Plan = {
  title: string;
  description: string;
  image_url: string;
  plan_date: string;
  duration_value: number;
  duration_unit: "hours" | "days" | "weeks";
  meetup_point_address: string;
  city: string;
  meetup_point_link: string;
  plan_category_id: number;
  capacity: number;
  is_free: boolean;
  amount: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: number;
};

export function generatePlans(numPlans: number = 10): Plan[] {
  const plans: Plan[] = [];
  const cities: string[] = ["Mumbai", "Goa"];
  const durationUnits: ("hours" | "days" | "weeks")[] = [
    "hours",
    "days",
    "weeks",
  ];

  for (let i = 0; i < numPlans; i++) {
    const isFree = faker.datatype.boolean();
    const durationUnit = faker.helpers.arrayElement(durationUnits);
    let durationValue: number;

    if (durationUnit === "hours")
      durationValue = faker.number.int({ min: 1, max: 24 });
    else if (durationUnit === "days")
      durationValue = faker.number.int({ min: 1, max: 7 });
    else durationValue = faker.number.int({ min: 1, max: 3 });

    plans.push({
      title: faker.lorem.words(5),
      description: faker.lorem.sentence(),
      image_url: faker.image.url(),
      plan_date: faker.date.future().toISOString(),
      duration_value: durationValue,
      duration_unit: durationUnit,
      meetup_point_address: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(cities),
      meetup_point_link: faker.internet.url(),
      plan_category_id: faker.number.int({ min: 1, max: 4 }),
      capacity: faker.number.int({ min: 5, max: 50 }),
      is_free: isFree,
      amount: isFree
        ? null
        : Number(
            faker.finance.amount({
              min: 100,
              max: 40000,
              dec: 2,
            })
          ),
      currency: "INR",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      user_id: 1,
    });
  }
  return plans;
}

const client = new Client({
  connectionString: ENV.DATABASE_URL as string,
});

// mock plan categories
const planCategories = async () => {
  console.log("Start : Seed Plan Categories");

  const data = await client.query(`INSERT INTO plan_categories (name) VALUES
        ('Casual Meetups') ,
        ('Food and Drinks') ,
        ('Travel and Outdoor') ,
        ('Hobbies and Intrestes')
        RETURNING id`);

  return data.rows;
};

// mock plan
const plans = async () => {
  console.log("Start : Seed Plans");

  const createdPlanIds = [];
  const userId = 1;

  // const plansData = [
  //   {
  //     title: "Republic Day Bike ride to Lonavla from Mumbai",
  //     description:
  //       "Lets ride to lonavla and have a ride of freedom celebrating on the Republic day. The ride will start at 6 AM near Honda BigWing centre and the flag off will be by 6:30 AM. There are experienced riders in the group to manage the ride properly.",
  //     image_url: "https://example.com/trek.jpg",
  //     plan_date: "2025-02-10 07:00:00",
  //     duration_value: 1,
  //     duration_unit: "days",
  //     meetup_point_address:
  //       "Shop No 7, Shivanta, Almeda Rd, near Nitin Company, Ramabai Ambedkar Nagar, Ganeshwadi, Thane West, Thane, Maharashtra 400601",
  //     city: cities[0],
  //     meetup_point_link: "https://g.co/kgs/wfikcu1",
  //     plan_category_id: 3,
  //     capacity: 15,
  //     is_free: false,
  //     amount: 2000,
  //   },
  //   {
  //     title: "Explore street food of borivali",
  //     description: "5-day trek in Himachal.",
  //     image_url: "https://example.com/trek.jpg",
  //     plan_date: "2025-02-10 07:00:00",
  //     duration_value: 5,
  //     duration_unit: "hours",
  //     meetup_point_address: "Raymond Store , Boriwali Railway Station West",
  //     city: cities[0],
  //     meetup_point_link: "https://goo.gl/maps/abcd1234",
  //     plan_category_id: 2,
  //     capacity: 5,
  //     is_free: true,
  //   },
  //   {
  //     title: "Pub Crawl at Goa",
  //     description:
  //       "Hey bois and girls , join with me to do a pub crawl at goa, lets get drunk and enjoy the goa vibes",
  //     image_url: "https://example.com/trek.jpg",
  //     plan_date: "2025-02-10 07:00:00",
  //     duration_value: 7,
  //     duration_unit: "hours",
  //     meetup_point_address: "Near Baga Beach, Goa",
  //     city: cities[3],
  //     meetup_point_link: "https://goo.gl/maps/abcd1234",
  //     plan_category_id: 1,
  //     capacity: 10,
  //     is_free: true,
  //   },
  // ];

  const plansDataFaker = generatePlans(30);

  for (let i = 0; i < plansDataFaker.length; i++) {
    const {
      title,
      description,
      image_url,
      plan_date,
      duration_value,
      duration_unit,
      meetup_point_address,
      city,
      meetup_point_link,
      plan_category_id,
      capacity,
      is_free,
      amount,
    } = plansDataFaker[i];

    const planRes = await client.query(
      `INSERT INTO plans (
        title, description, image_url, plan_date, duration_value, duration_unit, 
        meetup_point_address, city, meetup_point_link, plan_category_id, capacity, is_free, amount , user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `,

      [
        title,
        description,
        image_url,
        plan_date,
        duration_value,
        duration_unit,
        meetup_point_address,
        city,
        meetup_point_link,
        plan_category_id,
        capacity,
        is_free,
        amount,
        userId,
      ]
    );

    // console.log("planRes.rows[0]", planRes.rows);

    createdPlanIds.push(planRes.rows[0]);
  }
};

const createUser = async () => {
  console.log("Start : Seed Users");

  // hash for Sumit@2022
  const hash = "$2b$10$hQM.8XVPVy7.5jH4txx73ef9VFn3MaiMdO2UJq8IdT/.9Q8wGJCmq";

  const users = [
    {
      email: "sumit@gg.com",
      password: hash,
      bio: "hello wassup",
      name: "wassup",
    },
  ];

  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i];

    const userData = await client.query(
      `
        INSERT INTO users (
        name , email , password , bio )
        VALUES ($1, $2, $3, $4)
      `,
      [
        currentUser.name,
        currentUser.email,
        currentUser.password,
        currentUser.bio,
      ]
    );

    return userData.rows;
  }
};

// Remove functions

// const removePlanCategories = async () => {
//   const data = await client.query(`DROP TABLE IF EXISTS plan_categories;`);
// };

// const removePlans = async () => {
//   const plan = await client.query(`DROP TABLE IF EXISTS plans`);
//   const planDurationUnit = await client.query(
//     `DROP TYPE IF EXISTS plan_duration_unit`
//   );
// };

const seedData = async () => {
  const userData = await createUser();
  const planCategoriesData = await planCategories();
  const planData = await plans();
};

const removeSeedData = async () => {
  const plan = await client.query(`DROP TABLE IF EXISTS plans`);
  const data = await client.query(`DROP TABLE IF EXISTS plan_categories;`);
  const planDurationUnit = await client.query(
    `DROP TYPE IF EXISTS plan_duration_unit`
  );
};

const runCommand = async () => {
  await client.connect();

  const command = process.argv[2];

  try {
    switch (command) {
      case "seed":
        await seedData();
        break;
      case "clear":
        await removeSeedData();
        break;
      default:
        console.log("❌ Invalid command. Use one of the following:");
        console.log("npm run db-seed");
        console.log("npm run db-clear");
        break;
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

runCommand();
