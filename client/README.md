# 💻 Project & Portfolio II

# Project Name: WDP2 Portfolio Project

### Biesboer Terry

🆔 &nbsp; 0005223019

📪 &nbsp; tebiesboer@student.fullsail.edu

![Degree Program](https://img.shields.io/badge/Degree-Web%20Development-orange?logo=gnometerminal)
<br>
![Class Name](https://img.shields.io/badge/Class-Project%20and%20Portfolio%20II-orange?logo=react)

<br>

## 📢 &nbsp; Milestone Check-Ins

Each week I will summarize my milestone activity and progress by writing a stand-up. A stand-up is meant to be a succinct update on how things are going.  
Use the prompts below as a guide on what to write about.  
For each Milestone #2-4, you should use all 4 icons.

⚙️ Overview - What I worked on this past week
<br>
🌵 Challenges - What problems did I have & how I'm addressing them
<br>
🏆 Accomplishments - What is something I "leveled up" on this week
<br>
🔮 Next Steps - What I plan to prioritize and do next

<br>

### Milestone 1

For this milestone you will have created a wireframe prototype in Figma.  
Post your link here, so you have easy access to it.

- Figma Link

<br>

### Milestone 2

⚙️ Completed most routing and client pages and components
<br>
🌵 Time, I had a lot of family/social events and work last week. This caused me to fall behind
<br>
🏆 Accomplishments - Write Accomplishments here.
<br>
🔮 Complete styling and functionality

<br>

Please discuss the following:

#### Page #1

- Home
- Main landing page with quick links to products, categories, and contact

#### Page #2

- Cart
- This will show all items in customer cart

#### Page #3

- My Orders
- This will show the customer all orders placed through the system

#### Page #4

- Products
- Shows all available products

#### Remember that creating a project board, issues, and milestones is 50% of your grade!

If you are having trouble, contact your instructor ASAP, you might need to be part of the ePortoflio group to have better access.

<br>

### Milestone 3

⚙️ Overview - Integrated external API, migrated data (user, orders, address, products, krogerProducts)
<br>
🌵 Challenges - Integrating the Kroger API and making it work. Lots of adjustments to be made and I felt like I bit off more than I can chew with this one
<br>
🏆 Accomplishments - All persistent data is in MongoDB, Most of the data from Kroger API is displayed
<br>
🔮 Next Steps - Finish integreating Kroger products, polish and fine-tune the rest

<br>

Please discuss the following:

#### API

- https://api.kroger.com/v1/
- Kroger is a well known grocery store chain, wider selection of products to import
- I used this API to display live products from a stores website

#### 1st Library

- https://www.npmjs.com/package/react-toastify.
- [Biesboer_Terry_Library Tutorial](<[url](https://fullsailedu-my.sharepoint.com/:v:/g/personal/tebiesboer_student_fullsail_edu/IQDMqxExgwJzTI2C_MPlI5tnAQilgwhvRCRWmv76-uK3uGk?e=K5d1Ge&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)>)
- I've used it on previous projects and really enjoy its customization and effects.
- It is used in both the client side and the admin side

#### 2nd Library

- [Clerk](https://clerk.com/)
- I used this in the past, simple sign in using various methods, i.e. Apple, Google, GitHub, Facebook
- The package has been installed, login for will be updated this week

#### Persistent Data

- I went with MongoDB for storage. I am using it to store admin, users, orders, address, and products from the Kroger API
- Stores all persistent data (see above)
- Server side logic

<br>

### Milestone 4

⚙️ Overview - Completed project for milestone.
<br>
🌵 Challenges - Biggest challenges I faced this week was working with the intricacies of the Kroger API and Clerk.
<br>
🏆 Accomplishments - Getting the Mongo data to work well with the Kroger API and the Clerk system for logging in as a user. Both of these issues cause me more heartache than I care to share, but what a relief when I got there
<br>
🔮 Next Steps - Publishing to Vercel/GitHub to be able to share. Adding more integrations into the site for improved functionality. Add more Admin functionality.

<br>

Please discuss the following:

#### Changes

- I got Kroger to interact properly with the site, along with the Clerk integration. Added extra functionality for the newsletter and contact pages to save to Mongo when signing up/leaving feedback.

#### Styling

- I went with a pallete that I felt conveyed more of an earthly feeling as the products are intended to be healthy and natural. Various shades of greens and browns accomplish this. The use of all lowercase through the site I feel adds a bit of soft, calming effect, as well as a more personal level, not as sanitized.

#### Link To Overview Video

- Once it is created, put the link to your overview video of your site here.

<br>
<br>
<hr/>

# Project Overview

### Your project will use the MERN Tech Stack and must include the following:

- A Git Repo, with a master, dev, and milestone branches
- Readme File that explains your project and tracks your milestones
- A React Front End
- React Routing with _at least_ 4 different views/pages
    - Dashboard/Main
    - User/Settings
    - Search
    - Detail Page
- Node/Express Backend
- A Mongo DB Element OR Local Storage for persistent data
- Connect to at least 1 free API
- The project must use at least 2 different libraries, not including React itself
    - One of these libraries you will create a tutorial for in Exercise 01
- It should look visually appealing and must be easy for the end-user to use and understand. You may use Tailwind or any other front-end library/framework.

**Milestone #1 (Due: Monday of Week 2)**

- Decide on your topic and theme for your project.
    - Check out the Free API sites for some ideas of an API that you can utilize
        - [Apipheny](https://apipheny.io/free-api/)
        - [Mixed Analytics](https://mixedanalytics.com/blog/list-actually-free-open-no-auth-needed-apis/)
        - [I Am Sajan](https://iamsajan.com/free-api-without-an-api-key/)
- Functional Spec that explains the scope of the work and the deadlines that must be met.
- Create a Wireframe Prototype in Figma that will help non-tech people understand your idea.
    - Keep in mind that a lot of your bosses will need only high-level concepts and will not be concerned with the actual code. The code is your job.

**Milestone #2 **(Due: Monday of Week 3)\*\*\*\*

- Create your Git Repo using the provided link, which will clone over a blank repo.
- Start to code your project.
    - I will not give you a step-by-step guide for this.
    - At this point, you must use your skills and build it out yourself.
- Along the way, if you get stuck, you may reach out to the lab assistants, but remember this is YOUR portfolio project, and troubleshooting your own code is a part of this process.
- By Milestone #2, I am going to be checking that you have a React app that can compile without error and that you have your navigation up and running.

**Milestone #3 **(Due: Monday of Week 4)\*\*\*\*

- By this point, you should have a functional prototype of your project. It might not look pretty yet, but that is what the final week is for.
- Your Git Repo should have a number of significant commits pushed to it.

**Milestone #4 **(Due: Sunday of Week 4)\*\*\*\*

- Your completed project will be due.
- You must create a (3 to 10) minute long video that goes through your project, what you did this month, and the technologies that you used to get it working.
    - Remember it is your job to sell your work and really show it off.
