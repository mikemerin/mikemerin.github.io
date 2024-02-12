import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Menu, Segment } from 'semantic-ui-react';

import { actions } from '../../redux/actions';
import { selectors } from '../../redux/selectors';

import LinkButtons from './LinkButtons';

const Navbar = (): JSX.Element => {
  const dispatch = useDispatch();
  const { current, list } = useSelector(selectors.getPages);

  const handlePageChange = (event: any, result: any) => dispatch(actions.setCurrentPage(result.id));

  const generatePageButtons = () => (
    list.map(({ text, url }) => (
      <Link key={`page${text}`} to={url}>
        <Button
          className='NavbarButton'
          key={`navButton${text}`}
          id={text}
          active={current === text}
          size='small'
          onClick={handlePageChange}
        >
          {text}
        </Button>
      </Link>
    ))
  );

  return (
    <Segment inverted>
      <Menu className='Navbar' color='blue' fluid widths={3} inverted pointing fixed='top'>
        <Menu.Item name='pages'>
          {generatePageButtons()}
        </Menu.Item>
        <LinkButtons />
      </Menu>
    </Segment>
  )
}

export { Navbar };
