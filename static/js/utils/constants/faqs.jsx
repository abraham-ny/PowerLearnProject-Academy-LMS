const faqs = [
  {
    id: 1,
    question: 'Is the online course self-paced or scheduled?',
    answer: (
      <>
        It is self-paced but within a predefined period of time i.e. 4 months.
        We provide a calendar that you may use to view the live sessions. Tthe
        live sessions are available as recorded sessions on the learning
        platform and as a guide to the best way to learn throughout the program.
      </>
    ),
  },
  {
    id: 2,
    question:
      'When are the classes starting? / How can I log into the LMS Platform?',
    answer: (
      <>
        The first step is to sign-up on the Learning Management system here and
        use the unique password that was provided via your email. Begin by going
        through the Learner&apos;s guide.
      </>
    ),
  },
  {
    id: 3,
    question: 'What is the procedure of undertaking the courses?',
    answer: (
      <>
        It is a self-paced learning experience, you determine when to study
        within the predetermined schedule of 16 weeks. However, to manage and
        track your learning progress, you are advised to cover one technical
        module per week, soft skills and computing essentials.
        <br />
        The technical modules are Python, Dart With Flutter, Web Technologies
        and Database Development.
        <br />
        Whichever direction you go, your instructors will be there to assist
        every step of the way.
      </>
    ),
  },
  {
    id: 4,
    question: 'Which courses will we receive a certificate after completion?',
    answer: (
      <>
        You will receive a certificate for going through the 16 weeks upon
        completing all 6 modules during graduation.
      </>
    ),
  },
  {
    id: 5,
    question: 'Can I code without a laptop?',
    answer: (
      <>
        You can code on your phone using Replit. The LMS is also mobile adaptive
        and will offer a good experience on smartphones. However, we suggest an
        internet-connected laptop or PC for the best learning experience.
      </>
    ),
  },
  {
    id: 6,
    question: 'How can I record the class sessions for my reference?',
    answer: (
      <>
        The recorded lessons will always be shared on the LMS under the course.
        These recordings are always shared and will be available to all learners
        in the LMS. However, you can use screen recording tools to assist you to
        record videos to your phone or laptop. We recommend you use tools like
        Loom for PC or use any other screen recorder you find useful from your
        browser. You can also find screen recorders on the Google Play Store,
        Apple Store, or the Galaxy Store to record on your phone.
      </>
    ),
  },
  {
    id: 7,
    question: 'What modules would I learn in the software development course?',
    answer: (
      <>
        You will take five technical modules:
        <ul>
          <li>Python Programming</li>
          <li>Dart with Flutter Programming</li>
          <li>Database Development</li>
          <li>Web Technologies</li>
          <li>Computing Essentials</li>
        </ul>
        You will also have a chance to learn additional soft skills modules for
        Personal Development, Entrepreneurship, and Mental Health Support from
        our partners.
      </>
    ),
  },
  {
    id: 8,
    question: 'Are there any classes or sessions that I need to attend?',
    answer: (
      <>
        There are scheduled live sessions for each module that you can access.
        In case you miss a live session, you can access a recorded version on
        the learning platform (LMS) under the specified module. Occasionally,
        your instructor will request you for live sessions for mentorship
        sessions or even normal sessions. This will be discussed with students
        at the most appropriate time.
      </>
    ),
  },
  {
    id: 9,
    question:
      'How often and how much will learners interact with the instructor and other students?',
    answer: (
      <>
        Instructors will always be available for interaction by booking a
        consultation, hourly meetings, and reaching out to the instructor via
        the Learning Management System (LMS) under the specific module forum. Go
        to the Learning Platform section, click on the Curriculum, select
        Instructor, and the Instructor contact details will be displayed.
      </>
    ),
  },
  {
    id: 10,
    question: 'What are the technology requirements for the online course?',
    answer: (
      <>
        You will need a computer or a smartphone, stable Internet connection,
        and an updated version of a web browser e.g. Google Chrome, Mozilla
        Firefox, Microsoft Edge.
      </>
    ),
  },
  {
    id: 11,
    question: 'Is there a problem if I do not participate in all the modules?',
    answer: (
      <>
        You will be required to explore all modules in the first 4 weeks of your
        training, thereafter, you may specialize in your desired area of
        interest. However, database development and soft skills are required
        once you are awarded the scholarship. You are at liberty to select your
        desired module of interest, however, you will only receive certification
        for your completed module.
      </>
    ),
  },
  {
    id: 12,
    question:
      'How many hours on average per day do I need to successfully undertake the course?',
    answer: <>You need at least 3 hours a day, on average 18 hrs a week.</>,
  },
  {
    id: 13,
    question: 'Do I get a certificate at the end of the course?',
    answer: (
      <>
        At the end of the 16 weeks following the submission of a final project
        you will be awarded a junior developer certificate highlighting all
        modules successfully taken and completed.
      </>
    ),
  },
  {
    id: 14,
    question: 'How do I access my course?',
    answer: (
      <>
        You can access your course by logging in to Power Learn Project&apos;s
        learning management platform here with the unique credentials shared to
        your email. You may only log in with the email and password created at
        the time of registration and onboarding for successful applicants.
      </>
    ),
  },
  {
    id: 15,
    question: 'How do I know who is in my peer group?',
    answer: (
      <>
        Peer groups will be allocated in the course of your training journey
        considering gender, location, skill levels among others. The group
        members will also be shown on the learning management system once you
        log in into your profile.
      </>
    ),
  },
  {
    id: 16,
    question: 'How to submit the assignments on GitHub classrooms?',
    answer: (
      <ul>
        <li>Access the assignment from the link provided.</li>
        <li>Accept the assignment.</li>
        <li>
          A copy of the assignment will be made available under your GitHub
          account.
        </li>
        <li>
          You can then attempt the assignment as per the instructions laid out.
          You are free to clone the assignment to your local development
          environment.
        </li>
        <li>
          On completion, you then push your changes using the URL provided
          during assignment acceptance.
        </li>
        <li>
          Any code push is considered as a submission on GitHub classroom.
        </li>
      </ul>
    ),
  },
  {
    id: 17,
    question:
      'How to go about quiz submission and review of the answers for a learner?',
    answer: (
      <ul>
        <li>
          Each week of the various modules provides a quiz to evaluate your
          understanding of the week&apos;s topic.
        </li>
        <li>Access the quiz from the week in question.</li>
        <li>The questions are multiple choice.</li>
        <li>Read the question and understand it.</li>
        <li>Select your preferred answer.</li>
        <li>Please note the quiz has a duration of 10 minutes.</li>
        <li>When done with the quiz, you will be notified of your score.</li>
        <li>A view of the correct answer(s) will also be provided.</li>
      </ul>
    ),
  },
];

export default faqs;
