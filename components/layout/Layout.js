import Header from './Header';
import Marquee from '../ui/Marquee';

function Layout(props) {
  return (
    <div>
      <Marquee>
        SEEN A VISUAL ARTS REFERENCE IN MOVIES OR SERIES? SEND IT TO US HERE
      </Marquee>
      <Header />
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
