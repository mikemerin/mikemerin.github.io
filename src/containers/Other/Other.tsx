import React from 'react';
import { Segment, Divider } from 'semantic-ui-react';

const Other = (): JSX.Element => {
  const otherData = {
    volunteering: [
      {
        organization: 'Nepris Virtual Classroom',
        role: 'Volunteer Teacher',
        duration: '2015 – 2018',
        description: [
          'Provided programming and science education to underserved classrooms across 4 states.',
          'Created educational content reaching 1,000+ students, recognized as Top 1% contributor.',
        ]
      }
    ],
    hobbies: [
      {
        hobby: 'Amateur Musician & Audio Producer',
        description: [
          'Guitar Pro, FamiTracker, LSDJ, Sony Vegas Studio',
          'Composed and produced soundtracks for personal game projects using various digital audio workstations.',
          'Proficient in over a dozen musical instruments, primary includes piano, guitar, and bass.',
        ],
        link: 'https://soundcloud.com/mikemerin/sets',
        linkName: 'SoundCloud'
      },
      {
        hobby: 'Puzzle & Sudoku Contributor',
        description: [
          'Online community for solvers and creators of custom rulesets and puzzles',
          'Active contributor to the Logic Masters community creating complex puzzles.'
        ],
        link: 'https://logic-masters.de/Raetselportal/Benutzer/allgemein.php?name=Mikemerin',
        linkName: 'Logic Masters Profile'
      }
    ],
    interests: ['Music Production', 'Puzzle Design', 'Audio Engineering', 'Weather Systems', 'Open Source Software']
  };

  return (
    <div className='other-container'>
      <Segment className='faded padding-medium'>
        <h1>More About Me</h1>
        
        <h2 className='section-title'>Volunteer Experience</h2>
        <div className='volunteer-list'>
          {otherData.volunteering.length === 0 ? (
            <p className='placeholder'>No volunteer data yet. Add your volunteer experiences.</p>
          ) : (
            otherData.volunteering.map((volunteer, index) => (
              <div key={index} className='volunteer-item'>
                <div className='volunteer-header'>
                  <h3>{volunteer.role}</h3>
                  <span className='duration'>{volunteer.duration}</span>
                </div>
                <div className='organization'>{volunteer.organization}</div>
                <div>{volunteer.description.map((desc, i) => <p key={i}>{desc}</p>)}</div> 
                {index < otherData.volunteering.length - 1 && <Divider />}
              </div>
            ))
          )}
        </div>

        <Divider section />

        <h2 className='section-title'>Hobbies & Interests</h2>
        <div className='hobbies-section'>
          {otherData.hobbies.length === 0 ? (
            <p className='placeholder'>No hobbies data yet. Add your hobbies and interests.</p>
          ) : (
            <div className='hobbies-list'>
              {otherData.hobbies.map((item, index) => (
                <div key={index} className='hobby-item'>
                  <h4>{item.hobby}</h4>
                  <div>{item.description.map((desc, i) => <><p key={i}>{desc}</p><br /></>)}</div>
                  {item.link && (
                    <a href={item.link} target='_blank' rel='noopener noreferrer'>
                      My {item.linkName}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {otherData.interests.length > 0 && (
            <div className='interests-section'>
              <h3>Interests</h3>
              <div className='interest-tags'>
                {otherData.interests.map((interest, index) => (
                  <span key={index} className='interest-tag'>{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Segment>
    </div>
  );
};

export { Other };
