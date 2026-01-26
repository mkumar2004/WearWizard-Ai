import { SvgUri } from 'react-native-svg';

// Fix typo: Spting -> Spring
import SpringIcon from '../assets/images/Spring.svg';
import SummerIcon from '../assets/images/summer.svg';
import AutumnIcon from '../assets/images/autumn.svg';
import WinterIcon from '../assets/images/winter.svg';

const getSeasonIcon = (seasonType) => {
  switch (seasonType?.toLowerCase()) {
    case 'spring':
      return <SpringIcon width={60} height={60} />
    case 'summer':
      return <SummerIcon width={60} height={60} />
    case 'autumn':
    case 'fall':
      return <AutumnIcon width={60} height={60} />
    case 'winter':
      return <WinterIcon width={60} height={60} />
    default:
      return null
  }
}

export default getSeasonIcon