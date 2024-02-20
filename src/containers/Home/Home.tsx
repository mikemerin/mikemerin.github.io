import { Card, CardContent, CardDescription, CardHeader, CardMeta, Segment, SegmentGroup } from 'semantic-ui-react';

const Home = (): JSX.Element => (
  <>
    <Card className='centered'>
      <img src={`${process.env.PUBLIC_URL}/assets/Avatar.jpg`} alt='Mike Merin Avatar' />
      <CardContent>
        <CardHeader>Learning Code with Mike Merin</CardHeader>
        <CardMeta>
          Full Stack / React / Redux / TypeScript Dev
        </CardMeta>
        <CardDescription>
          I'm a meteorologist-turned-programmer. You can find my blog, projects, and GitHub using the navbar above.
        </CardDescription>
      </CardContent>
    </Card>
    <SegmentGroup className='centerMedium'>
      <Segment color='blue'>
        <h4>
          I love teaching, so what other way to do so than educating others?
          <br />
          I have blogs teaching Languages like Ruby, JS/TS, Python, and more,
          <br />
          with each blog written in the style of helping others learn new techniques
          <br />
          or improve on existing ones, all in the spirit of being a better programmer.
        </h4>
      </Segment>
      <Segment color='grey'>
        <h3><i>Note: This site is a work in progress as I finish porting over posts from my old blog, and add new features to this one. Updates include:</i></h3>
        <div>Add and convert old blog posts (around 8 remaining) to new format</div>
        <div>Add remaining data to current converted blog posts</div>
        <div>Show related posts/categories with links</div>
        <div>Language toggling for those specific type of posts</div>
        <div>Blog/project search with URL support</div>
        <div>Add section summaries to home page</div>
        <div>Add animations and clean up CSS</div>
      </Segment>
    </SegmentGroup>
  </>
);

export { Home };
