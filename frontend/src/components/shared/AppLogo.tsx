import { Image } from '@mantine/core';
import cgLogo from '../../assets/cg-logo.jpg';

interface AppLogoProps {
  h?: number;
}

export const AppLogo = ({ h = 50 }: AppLogoProps) => {
  return (
    <Image
      src={cgLogo}
      alt="Consultoría Global"
      w="auto"
      h={h}
      fit="contain"
    />
  );
};
