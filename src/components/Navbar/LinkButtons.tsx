import { useState } from 'react';
import { Menu, Modal, Icon, Popup, SemanticICONS } from 'semantic-ui-react';

type ButtonInfo = {
  content: string,
  url: string,
  icon: string,
};

const buttons: ButtonInfo[] = [
  { content: 'Github', url: 'http://github.com/mikemerin', icon: 'github square' },
  { content: 'LinkedIn', url: 'https://www.linkedin.com/in/mike-merin/', icon: 'linkedin square' },
];

const buttonTemplate = ({ content, url, icon }: ButtonInfo): JSX.Element => (
  <Popup key={content} position='bottom center' content={content} trigger={
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Icon className='NavbarButton' name={icon as SemanticICONS} />
    </a>
  } />
);

const LinkButtons = (): JSX.Element => {
  const [open, setOpen] = useState(false)

  return (
    <Menu.Item name='links'>
      {buttons.map((button) => buttonTemplate({ ...button }))}
      <Modal
        className='modalText'
        closeIcon
        dimmer='blurring'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='tiny'
        trigger={<Icon name='info' className='NavbarButton clickable' />}
      >

        <Modal.Header>Learning Code with Mike Merin - Version 0.1.0</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>This website was created by Mike Merin</p><br />
            <p>Built with React/Redux/TypeScript and Semantic-UI-React</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </Menu.Item>
  );
};

export default LinkButtons;
