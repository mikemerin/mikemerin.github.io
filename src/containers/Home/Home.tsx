import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardMeta, Segment, SegmentGroup } from 'semantic-ui-react';

const Home = (): JSX.Element => (
  <>
  <SegmentGroup horizontal piled className='faded padding-medium'>
    <Card className='centered' raised>
      <img src={`${process.env.PUBLIC_URL}/assets/Avatar.jpg`} alt='Mike Merin Avatar' />
      <CardContent>
        <CardHeader>Mike Merin</CardHeader>
        <CardMeta>
          Full Stack / React / Redux / TS / Kotlin Dev
        </CardMeta>
        <CardDescription>
          I love teaching, so what other way to do so than educating others?
          <br />
          <br />
          My blogs can help you learn new techniques, or improve on existing ones, all in the spirit of being a better programmer.
        </CardDescription>
      </CardContent>
    </Card>
    <SegmentGroup className='centerMedium' raised>
      <Segment color='blue'>
        <h1>Learning Code with Mike Merin</h1>
      </Segment>
      <Segment>        
        <h5>You can find my blog, projects, GitHub, and more using the navbar above.</h5>
      </Segment>
      <Segment color='grey'>
        <h3><i>Featured Content Areas:</i></h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/blog?tab=tags&tag=TypeScript" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>TypeScript & Advanced Types</h4>
              <p>Master generics, keyof, typeof, enums, and type systems</p>
            </div>
          </Link>
          <Link to="/blog?tab=tags&tag=Git" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>Git Mastery</h4>
              <p>From commits and branches to log visualization and cleanup</p>
            </div>
          </Link>
          <Link to="/blog?tab=tags&tag=JavaScript" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>JavaScript Techniques</h4>
              <p>Array methods, event loops, destructuring, and more</p>
            </div>
          </Link>
          <Link to="/blog?tab=tags&tag=NPM" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>Development Tools</h4>
              <p>npm, bash scripting, VS Code hotkeys, and workflow optimization</p>
            </div>
          </Link>
          <Link to="/blog?tab=tags&tag=React" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>React & State Management</h4>
              <p>Hooks, Redux, lifecycle methods, and best practices</p>
            </div>
          </Link>
          <Link to="/blog?tab=series" className='featured-content-link'>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', height: '100%' }}>
              <h4>Language Comparisons</h4>
              <p>Ruby, Python, PHP, SQL, and how they relate to JavaScript</p>
            </div>
          </Link>
        </div>
      </Segment>
    </SegmentGroup>
      <Card className='centered' raised>
      <CardContent>
        <CardHeader>More About Me</CardHeader>
        <CardMeta>
          See my experience <Link to="/experience"><u>here</u></Link>
        </CardMeta>
        <CardDescription>
          I'm a meteorologist-turned-programmer.
          <br/>
          <br />
          Coding was a way to automate my work, then was a hobby for video game development, then I made it my career.
          <br />
          <br />
          I am a Staff Engineer with over a decade of experience in full stack development, specializing in front‑end technologies and design systems, back‑end microservices, and AI‑powered tool integration.
          <br />
          <br />
          I am tech lead and project manager for large‑scale, international projects, with a strong track record in mentoring, driving technical innovation, and implementing UI/UX/E2E best practices across complex systems.
        </CardDescription>
      </CardContent>
    </Card>
  </SegmentGroup>
    
  </>
);

export { Home };
