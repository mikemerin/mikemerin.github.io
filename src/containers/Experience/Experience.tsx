import React from 'react';
import { Segment, Divider } from 'semantic-ui-react';

const Experience = (): JSX.Element => {
  const resumeData = {
    experience: [
      {
        company: 'Ridgeline',
        team: 'Trade Order Management / Electronic Trading',
        titles: ['Staff Software Engineer'],
        durations: ['Mar 2025 – Present'],
        description: [
          'Core FE and BE developer using React/TS, Kotlin microservices, and Datadog integration, leading firmwide initiatives and partnerships',
          'Delivered tools reducing debug time and eliminating external licenses, saving 1,000+ internal/external work hours and $100k+ annually',
          'Leveraged AI‑assisted code analysis and generation to standardize code and reduce production issues, exponentially accelerating dev velocity',
          'Enhanced AI‑powered automation infrastructure using Kotlin services for agent execution logic, tool integrations, and service orchestration',
          'Architected Module Federation, monorepos, shared libraries, and consolidated testing frameworks',
          'Delivered company‑wide educational resources and regularly demoed features to teams, mentoring engineers',
        ],
        technologies: ['TypeScript', 'React', 'Kotlin', 'DataDog', 'AI', 'Claude AI'],
      },
      {
        company: 'Goldman Sachs',
        team: 'Marquee Prime Brokerage Division',
        titles: ['Vice President', 'Associate'],
        durations: ['Dec 2022 – Mar 2025', 'Aug 2021 – Dec 2022'],
        description: [
          'Led large‑scale projects including Marquee’s first international initiative What If, driving FE development using React/Redux/TS',
          'Established firm‑wide architecture. dev standards, component libraries and packages, as tech lead, project manager, and primary UI dev',
          'Optimized CI/CD infrastructure with 120% faster builds and enhanced reliability; designed auto‑deploy systems leveraging Module Federation',
          'Developed financial analytics and validation programs using Node and Python for portfolio, trade, and execution platforms'
        ],
        technologies: ['TypeScript', 'React', 'Redux', 'Python', 'Node.JS', 'Snowflake', 'Swagger']
      },
      {
        company: 'Lab49',
        team: 'Fintech Consultant',
        titles: ['Senior Web UI Developer', 'Web UI Developer'],
        durations: ['Apr 2021 – Aug 2021', 'Nov 2019 – Apr 2021'],
        description: [
          'Project lead and dev for large‑scale domestic and international projects, with heavy internal/external team collaboration',
          'Designed and built web apps using React/Redux, TypeScript, NextJS, JWT, AWS SSO, and Tailwind with end‑to‑end ownership',
          'Spearheaded interview program conducting 100+ technical interviews and implemented process improvements'
        ],
        technologies: ['TypeScript', 'React', 'Redux', 'NextJS', 'JWT', 'Node.js', 'AWS SSO', 'Tailwind']
      },
      {
        company: 'Northwell Health',
        team: 'Pathology Informatics Division',
        titles: ['Software Developer'],
        durations: ['Dec 2017 – Nov 2019'],
        description: [
          'Engineered full stack web apps, system redesigns, web services, ETL processes, and data reporting tools with admin dashboards',
          'Managed internal headless CMS platforms for hospital and lab systems, accompanied by the network’s first public test catalog'
        ],
        technologies: ['JavaScript', 'Ruby', 'Rails', 'HTML/CSS']
      },
      {
        company: 'Metro Weather',
        titles: ['Software Developer', 'Senior Meteorologist, Weather Anchor, Forensic Specialist'],
        durations: ['Feb 2015 – Nov 2019', 'Jul 2010 – Sep 2017'],
        description: [
          'Engineered suite of internal/external applications, including React‑based data aggregation tool with automated reporting',
          'End‑to‑end product ownership and cross‑platform integration'
        ],
        technologies: ['React', 'VBA', 'JavaScript', 'Ruby', 'HTML/CSS']
      },
    ],
    education: [
      {
        school: 'Flatiron School',
        degree: 'Software Engineering Program',
        field: 'Full Stack Web Development',
        details: [
          'Completed intensive 15‑week full stack web development bootcamp, creating 13 projects, including cohort‑leading final project WeatherCraft',
          'Mastered technologies including MySQL, PostgreSQL, Ruby on Rails, JavaScript, React, and Redux'
        ]
      },
      {
        school: 'Stony Brook University',
        degree: 'Bachelor of Science',
        field: 'Atmospheric and Oceanic Sciences',
        details: ['Comprehensive study of weather systems, climate, and meteorological principles']
      }
    ],
    skills: {
      'Front-End': ['TypeScript', 'JavaScript', 'Redux', 'React', 'Ruby', 'Rails', 'Jest', 'Cypress', 'Storybook', 'jQuery', 'HTML/CSS', 'SASS', 'JWT'],
      'Back-End': ['Kotlin', 'Python', 'Rails', 'Node.js', 'REST', 'SQL', 'GraphQL', 'Swagger', 'VBA'],
      'Development/Other': ['NPM', 'Webpack', 'DataDog', 'AWS', 'Git', 'Bash', 'Jira', 'GML'],
      'AI / Automation': ['Claude Sonnet/Opus', 'Copilot', 'Cursor', 'Codex']
    }
  };

  return (
    <div className='experience-container'>
      <Segment className='faded padding-medium' color='blue' piled>
        <h1>Experience</h1>
        <div className='experience-list'>
          {(
            resumeData.experience.map((job, index) => (
              <Segment color='blue'>
                <div key={index} className='experience-item'>
                  <h3 className='company'>{job.company}</h3>
                  {job.titles.map((_job, i) => (
                    <div className='job-header'>
                      <h5>{job.titles[i]}</h5>
                      <span className='duration'>{job.durations[i]}</span>
                    </div>
                  ))}
                  <div className='job-description'>
                    <ul>
                      {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                  </div>
                  {job.technologies && job.technologies.length > 0 && (
                    <div className='technologies'>
                      {job.technologies.map((tech, i) => (
                        <span key={i} className='tech-badge'>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Segment>
            ))
          )}
        </div>

        <Divider section />

        <h2>Education</h2>
        <div className='education-list'>
          {resumeData.education.map((edu, index) => (
              <Segment color='blue'>
                <div key={index} className='education-item'>
                  <div className='edu-header'>
                    <h3>{edu.degree}{edu.field && ` in ${edu.field}`}</h3>                  
                  </div>
                  <div className='school'>{edu.school}</div>
                  {edu.details && (
                    <div className='details'>
                      {edu.details.map((detail, i) => (
                        <p key={i}>{detail}</p>
                      ))}
                    </div>
                  )}
                </div>
              </Segment>
            ))}
        </div>

        <Divider section />

        <h2 className='section-title'>Technical Skills</h2>
        <div className='skills-list'>
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div key={category} className='skill-category'>
              <h4>{category}</h4>
              <div className='skill-tags'>
                {skills.map((skill, index) => (
                  <span key={index} className='skill-tag'>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Segment>
    </div>
  );
};

export { Experience };
